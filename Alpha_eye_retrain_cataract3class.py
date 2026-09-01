# %% [markdown]
# Percent-format notebook script. Open with VS Code / Jupyter / PyCharm as a notebook,
# or run `jupytext --to notebook this_file.py` to get back a .ipynb.

# %% [markdown]
# # Alpha Eye — Cataract Classifier Retraining (3-Class)
#
# This notebook retrains the cataract classification model used by the Alpha Eye API
# (`alpha_eye_api/app.py`) on the **`suyog17/cataracteyedata`** dataset (Mild / Moderate /
# Normal — 3-class mobile screening set).
#
# **Why this dataset instead of ODIR-5K:** the deployed API (`CLASSES = ['Mild Cataract',
# 'Moderate Cataract', 'Normal Eye']`) expects a 3-class cataract-severity model, but the
# model currently in `alpha_eye_api/` was trained on ODIR-5K's `Normal / Cataract / Glaucoma`
# labels — a mismatch with what the app actually reports. This notebook also fixes a second
# mismatch: the old training pipeline rescaled images to `[0, 1]`, but `app.py` preprocesses
# inference images to `[-1, 1]` (MobileNetV2-style). This notebook trains with the *same*
# `[-1, 1]` preprocessing so training and inference are consistent.
#
# **Run this in Google Colab** (Runtime → Change runtime type → GPU). The project machine
# this was written on has 4GB RAM / no usable GPU and cannot train this in a reasonable time.
#
# This notebook produces every artifact typically needed for a project report:
# - Training/validation accuracy & loss curves (both training phases)
# - Held-out test set: classification report (precision/recall/F1), confusion matrix
# - ROC curves + AUC per class
# - Sample prediction grid (qualitative results)
# - Model size, parameter count, and per-image inference latency
# - A quantized `.tflite` export with a Keras-vs-TFLite sanity check
# - All figures/tables saved to `report_outputs/` and zipped for download
#

# %% [markdown]
# ## 0. Getting your `kaggle.json` (Kaggle API credentials)
#
# `kagglehub`/`kaggle` need an API token to download datasets. To get yours:
#
# 1. Go to [kaggle.com](https://www.kaggle.com) and sign in (create a free account if you don't have one).
# 2. Click your profile picture (top-right) → **Settings**.
# 3. Scroll to the **API** section.
# 4. Click **Create New Token**. This downloads a file called `kaggle.json` containing your username and key.
# 5. **In Colab:** open the file browser (folder icon, left sidebar) and drag-and-drop `kaggle.json` into the file list (it lands in `/content/`). The setup cell below will pick it up automatically.
#    **Running locally instead:** put it at `~/.kaggle/kaggle.json` and run `chmod 600 ~/.kaggle/kaggle.json`.
#
# Keep this file private — it's a credential, don't commit it to git or share it.
#
# *(Alternative: skip the file entirely and call `kagglehub.login()` in the cell below — it opens an interactive prompt for your username/key instead.)*
#

# %%
!pip install -q kagglehub scikit-learn seaborn

# %%
import os, shutil

# Pick up kaggle.json from Colab's /content or a local ~/.kaggle, and export
# it as env vars so kagglehub can find credentials without extra setup.
candidate_paths = ['/content/kaggle.json', os.path.expanduser('~/.kaggle/kaggle.json')]
kaggle_json = next((p for p in candidate_paths if os.path.exists(p)), None)

if kaggle_json:
    os.makedirs(os.path.expanduser('~/.kaggle'), exist_ok=True)
    target = os.path.expanduser('~/.kaggle/kaggle.json')
    if kaggle_json != target:
        shutil.copy(kaggle_json, target)
    os.chmod(target, 0o600)
    import json as _json
    with open(target) as f:
        creds = _json.load(f)
    os.environ['KAGGLE_USERNAME'] = creds['username']
    os.environ['KAGGLE_KEY'] = creds['key']
    print("Kaggle credentials loaded from", kaggle_json)
else:
    print("No kaggle.json found. If the download below fails with an auth error, "
          "either upload kaggle.json (see Section 0) or run kagglehub.login() here.")
    # import kagglehub
    # kagglehub.login()

# %% [markdown]
# ## 1. Download the dataset

# %%
import kagglehub

# Download latest version
dataset_path = kagglehub.dataset_download("suyog17/cataracteyedata")
print("Path to dataset files:", dataset_path)

# %% [markdown]
# ## 2. Discover the dataset structure
#
# Kaggle datasets vary in folder layout (e.g. `train/<class>/*.jpg` vs `<class>/*.jpg`
# vs a flat CSV + image folder). Rather than hardcode a path that might not match, this
# cell walks the downloaded directory, prints the tree, and counts images per folder so
# we can see exactly what we're working with before building the dataframe.

# %%
import pathlib

root = pathlib.Path(dataset_path)
IMG_EXTS = {'.jpg', '.jpeg', '.png', '.bmp'}

print(f"Dataset root: {root}\n")
print("Directory tree (folders containing images, with image counts):\n")

folder_counts = {}
for dirpath, dirnames, filenames in os.walk(root):
    imgs = [f for f in filenames if pathlib.Path(f).suffix.lower() in IMG_EXTS]
    if imgs:
        rel = pathlib.Path(dirpath).relative_to(root)
        folder_counts[dirpath] = len(imgs)
        print(f"  {rel}/  ->  {len(imgs)} images")

total_images = sum(folder_counts.values())
print(f"\nTotal images found: {total_images}")

# Also show any non-image files at the top level (csv/xlsx metadata, README, etc.)
print("\nTop-level files/folders:")
for p in sorted(root.iterdir()):
    print(" ", p.name)

# %% [markdown]
# ## 3. Build the (filepath, label) dataframe
#
# We treat every leaf folder that contains images as a class, using the folder name as
# the raw label (this handles both a flat `<class>/*.jpg` layout and a `train/<class>/*.jpg`
# / `test/<class>/*.jpg` layout — in the latter case we merge train+test here and do our
# own stratified split later, so the whole dataset is used and the split is under our
# control and reproducible).
#
# Raw folder-name labels are then mapped to the **exact 3 classes the API expects**
# (`Mild Cataract`, `Moderate Cataract`, `Normal Eye`) via keyword matching. If your
# dataset's folder names don't match the keywords below, edit `LABEL_KEYWORDS`.

# %%
import pandas as pd

records = []
for dirpath, count in folder_counts.items():
    folder_name = pathlib.Path(dirpath).name
    for fname in os.listdir(dirpath):
        if pathlib.Path(fname).suffix.lower() in IMG_EXTS:
            records.append({'filepath': str(pathlib.Path(dirpath) / fname), 'raw_label': folder_name})

raw_df = pd.DataFrame(records)
print("Raw label folders found:", raw_df['raw_label'].unique().tolist())
print(raw_df['raw_label'].value_counts())

# %%
# Map raw folder names -> canonical API class names, by keyword.
# Edit these keyword lists if your dataset uses different folder names
# (e.g. 'immature'/'mature' instead of 'mild'/'moderate').
LABEL_KEYWORDS = {
    'Normal Eye': ['normal'],
    'Mild Cataract': ['mild', 'immature', 'early'],
    'Moderate Cataract': ['moderate', 'severe', 'mature', 'advanced'],
}

def map_label(raw_label):
    raw = raw_label.lower()
    for canonical, keywords in LABEL_KEYWORDS.items():
        if any(k in raw for k in keywords):
            return canonical
    return None

raw_df['label'] = raw_df['raw_label'].apply(map_label)
unmapped = raw_df[raw_df['label'].isna()]['raw_label'].unique()
if len(unmapped) > 0:
    print(f"WARNING: {len(unmapped)} folder name(s) did not match any keyword and will be dropped: {list(unmapped)}")
    print("If these should be included, add matching keywords to LABEL_KEYWORDS above and re-run this cell.")

df = raw_df.dropna(subset=['label']).reset_index(drop=True)

# This must match app.py's CLASSES order exactly.
CLASSES = ['Mild Cataract', 'Moderate Cataract', 'Normal Eye']
found_classes = sorted(df['label'].unique())
assert set(found_classes) == set(CLASSES), (
    f"Expected exactly {CLASSES} after mapping, got {found_classes}. "
    "Adjust LABEL_KEYWORDS above to match this dataset's folder names."
)

print(f"\nFinal dataset: {len(df)} images across {len(CLASSES)} classes")
print(df['label'].value_counts())

# %%
import matplotlib.pyplot as plt
import seaborn as sns

os.makedirs('report_outputs', exist_ok=True)

plt.figure(figsize=(6, 4))
sns.countplot(data=df, x='label', order=CLASSES, hue='label', palette='viridis', legend=False)
plt.title('Class Distribution')
plt.xlabel('')
plt.ylabel('Number of Images')
plt.tight_layout()
plt.savefig('report_outputs/class_distribution.png', dpi=150)
plt.show()

# %% [markdown]
# ## 4. Train / Validation / Test split
#
# An 70/15/15 stratified split. The test set is held out entirely from training and
# used only in Section 9 for the final report metrics (confusion matrix, ROC, etc.) —
# this gives an honest, unbiased evaluation rather than reporting validation numbers
# the model's hyperparameters were already tuned against.

# %%
from sklearn.model_selection import train_test_split

train_df, temp_df = train_test_split(df, test_size=0.30, stratify=df['label'], random_state=42)
val_df, test_df = train_test_split(temp_df, test_size=0.50, stratify=temp_df['label'], random_state=42)

print(f"Train: {len(train_df)}  |  Val: {len(val_df)}  |  Test: {len(test_df)}")
for name, split in [('Train', train_df), ('Val', val_df), ('Test', test_df)]:
    print(f"\n{name} distribution:")
    print(split['label'].value_counts())

# %% [markdown]
# ## 5. Data generators
#
# Uses `mobilenet_v2.preprocess_input` (scales to `[-1, 1]`) to match `app.py`'s inference preprocessing exactly. Augmentation is applied to the training split only.

# %%
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

print("GPU available:", tf.config.list_physical_devices('GPU'))

IMG_SIZE = (224, 224)
BATCH_SIZE = 32

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,
    rotation_range=30,
    width_shift_range=0.25,
    height_shift_range=0.25,
    shear_range=0.2,
    zoom_range=0.2,
    brightness_range=[0.7, 1.3],
    horizontal_flip=True,
    fill_mode='nearest'
)
eval_datagen = ImageDataGenerator(preprocessing_function=preprocess_input)

train_generator = train_datagen.flow_from_dataframe(
    dataframe=train_df, x_col='filepath', y_col='label',
    target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', classes=CLASSES, shuffle=True
)
val_generator = eval_datagen.flow_from_dataframe(
    dataframe=val_df, x_col='filepath', y_col='label',
    target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', classes=CLASSES, shuffle=False
)
test_generator = eval_datagen.flow_from_dataframe(
    dataframe=test_df, x_col='filepath', y_col='label',
    target_size=IMG_SIZE, batch_size=BATCH_SIZE,
    class_mode='categorical', classes=CLASSES, shuffle=False
)

print("\nClass index mapping (must match CLASSES order):", train_generator.class_indices)
assert list(train_generator.class_indices.keys()) == CLASSES, "Class order mismatch with app.py!"

# %%
from sklearn.utils.class_weight import compute_class_weight
import numpy as np

class_weight_values = compute_class_weight(
    class_weight='balanced',
    classes=np.arange(len(CLASSES)),
    y=train_df['label'].map({c: i for i, c in enumerate(CLASSES)}).values
)
class_weight = dict(enumerate(class_weight_values))
print("Class weights (to correct for class imbalance):", class_weight)

# %% [markdown]
# ## 6. Model definition (MobileNetV2 + regularized head)

# %%
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l2

base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(*IMG_SIZE, 3))
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu', kernel_regularizer=l2(0.001))(x)
x = Dropout(0.5)(x)
predictions = Dense(len(CLASSES), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)
model.compile(optimizer=Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])
model.summary()

# %%
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, CSVLogger

MODEL_OUT = 'best_cataract_model.keras'

checkpoint = ModelCheckpoint(MODEL_OUT, monitor='val_accuracy', save_best_only=True, mode='max', verbose=1)
early_stop = EarlyStopping(monitor='val_loss', patience=7, restore_best_weights=True, verbose=1)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=3, min_lr=1e-6, verbose=1)
csv_logger = CSVLogger('report_outputs/training_log.csv')

# %% [markdown]
# ## 7. Phase 1 — train the classification head
#
# Base model frozen; only the new Dense/Dropout head is trained.

# %%
EPOCHS_HEAD = 20

history_head = model.fit(
    train_generator,
    epochs=EPOCHS_HEAD,
    validation_data=val_generator,
    class_weight=class_weight,
    callbacks=[checkpoint, early_stop, reduce_lr, csv_logger]
)

# %% [markdown]
# ## 8. Phase 2 — fine-tune the base model
#
# Unfreeze the last 50 layers of MobileNetV2 and continue training at a much lower learning rate.

# %%
base_model.trainable = True
for layer in base_model.layers[:-50]:
    layer.trainable = False

print(f"Trainable layers in base model: {len([l for l in base_model.layers if l.trainable])}")

model.compile(optimizer=Adam(learning_rate=1e-5), loss='categorical_crossentropy', metrics=['accuracy'])

EPOCHS_FINE_TUNE = 20

history_fine_tune = model.fit(
    train_generator,
    epochs=EPOCHS_FINE_TUNE,
    initial_epoch=history_head.epoch[-1] + 1,
    validation_data=val_generator,
    class_weight=class_weight,
    callbacks=[checkpoint, early_stop, reduce_lr, csv_logger]
)

# %% [markdown]
# ## 9. Report artifacts

# %% [markdown]
# ### 9.1 Training/validation accuracy & loss curves

# %%
total_acc = history_head.history['accuracy'] + history_fine_tune.history['accuracy']
total_val_acc = history_head.history['val_accuracy'] + history_fine_tune.history['val_accuracy']
total_loss = history_head.history['loss'] + history_fine_tune.history['loss']
total_val_loss = history_head.history['val_loss'] + history_fine_tune.history['val_loss']
fine_tune_start = len(history_head.history['accuracy'])

fig, axes = plt.subplots(2, 1, figsize=(10, 10))

axes[0].plot(total_acc, label='Training Accuracy')
axes[0].plot(total_val_acc, label='Validation Accuracy')
axes[0].axvline(fine_tune_start, color='gray', linestyle='--', label='Fine-tuning start')
axes[0].set_title('Training and Validation Accuracy')
axes[0].set_xlabel('Epoch'); axes[0].set_ylabel('Accuracy'); axes[0].legend(); axes[0].grid(True)

axes[1].plot(total_loss, label='Training Loss')
axes[1].plot(total_val_loss, label='Validation Loss')
axes[1].axvline(fine_tune_start, color='gray', linestyle='--', label='Fine-tuning start')
axes[1].set_title('Training and Validation Loss')
axes[1].set_xlabel('Epoch'); axes[1].set_ylabel('Loss'); axes[1].legend(); axes[1].grid(True)

plt.tight_layout()
plt.savefig('report_outputs/training_curves.png', dpi=150)
plt.show()

# %% [markdown]
# ### 9.2 Held-out test set evaluation
#
# Load the best checkpoint (by validation accuracy) and evaluate on the test split that was never seen during training or model selection.

# %%
model.load_weights(MODEL_OUT)

test_loss, test_accuracy = model.evaluate(test_generator)
print(f"\nFinal Test Loss: {test_loss:.4f}")
print(f"Final Test Accuracy: {test_accuracy:.4f}")

# %% [markdown]
# ### 9.3 Classification report & confusion matrix

# %%
from sklearn.metrics import classification_report, confusion_matrix

test_generator.reset()
y_prob = model.predict(test_generator)
y_pred = np.argmax(y_prob, axis=1)
y_true = test_generator.classes

report_text = classification_report(y_true, y_pred, target_names=CLASSES)
print(report_text)

with open('report_outputs/classification_report.txt', 'w') as f:
    f.write(report_text)

report_dict = classification_report(y_true, y_pred, target_names=CLASSES, output_dict=True)
pd.DataFrame(report_dict).transpose().to_csv('report_outputs/classification_report.csv')

cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=CLASSES, yticklabels=CLASSES)
plt.title('Confusion Matrix (Test Set)')
plt.xlabel('Predicted'); plt.ylabel('True')
plt.tight_layout()
plt.savefig('report_outputs/confusion_matrix.png', dpi=150)
plt.show()

# %% [markdown]
# ### 9.4 ROC curves and AUC (one-vs-rest)

# %%
from sklearn.preprocessing import label_binarize
from sklearn.metrics import roc_curve, auc

y_true_bin = label_binarize(y_true, classes=list(range(len(CLASSES))))

plt.figure(figsize=(7, 6))
for i, cls in enumerate(CLASSES):
    fpr, tpr, _ = roc_curve(y_true_bin[:, i], y_prob[:, i])
    roc_auc = auc(fpr, tpr)
    plt.plot(fpr, tpr, label=f'{cls} (AUC = {roc_auc:.3f})')

plt.plot([0, 1], [0, 1], 'k--', alpha=0.4)
plt.xlabel('False Positive Rate'); plt.ylabel('True Positive Rate')
plt.title('ROC Curves — One-vs-Rest (Test Set)')
plt.legend(loc='lower right')
plt.tight_layout()
plt.savefig('report_outputs/roc_curves.png', dpi=150)
plt.show()

# %% [markdown]
# ### 9.5 Sample predictions (qualitative results)

# %%
sample_idx = np.random.choice(len(test_df), size=min(12, len(test_df)), replace=False)
sample_paths = test_df.iloc[sample_idx]['filepath'].values
sample_true = test_df.iloc[sample_idx]['label'].values

fig, axes = plt.subplots(3, 4, figsize=(16, 12))
for ax, path, true_label in zip(axes.flatten(), sample_paths, sample_true):
    img = tf.keras.utils.load_img(path, target_size=IMG_SIZE)
    arr = preprocess_input(np.expand_dims(tf.keras.utils.img_to_array(img), axis=0))
    pred = model.predict(arr, verbose=0)[0]
    pred_label = CLASSES[np.argmax(pred)]
    confidence = pred.max() * 100
    correct = pred_label == true_label

    ax.imshow(img)
    ax.set_title(f"True: {true_label}\nPred: {pred_label} ({confidence:.1f}%)",
                 color='green' if correct else 'red', fontsize=9)
    ax.axis('off')

plt.tight_layout()
plt.savefig('report_outputs/sample_predictions.png', dpi=150)
plt.show()

# %% [markdown]
# ### 9.6 Model size, parameters, and inference latency
#
# Relevant for the report given this is deployed as a mobile-facing API — the report should state how big the model is and how fast a single prediction is.

# %%
import time, json

trainable_params = sum(np.prod(v.shape) for v in model.trainable_weights)
non_trainable_params = sum(np.prod(v.shape) for v in model.non_trainable_weights)
total_params = trainable_params + non_trainable_params

keras_size_mb = os.path.getsize(MODEL_OUT) / (1024 * 1024)

# Benchmark single-image inference latency (CPU, matching how app.py serves predictions)
sample_batch = next(iter(test_generator))[0][:1]
n_runs = 30
times = []
for _ in range(n_runs):
    t0 = time.time()
    model.predict(sample_batch, verbose=0)
    times.append((time.time() - t0) * 1000)

latency_summary = {
    'total_params': int(total_params),
    'trainable_params': int(trainable_params),
    'non_trainable_params': int(non_trainable_params),
    'keras_model_size_mb': round(keras_size_mb, 2),
    'mean_inference_ms': round(np.mean(times), 2),
    'p95_inference_ms': round(np.percentile(times, 95), 2),
}
print(json.dumps(latency_summary, indent=2))

with open('report_outputs/model_stats.json', 'w') as f:
    json.dump(latency_summary, f, indent=2)

# %% [markdown]
# ## 10. Convert to TFLite (quantized) — matches `convert_to_tflite.py`
#
# Also sanity-checks that the TFLite model's predictions match the Keras model's, since a silent conversion bug would otherwise only surface in production.

# %%
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

TFLITE_OUT = 'best_cataract_model.tflite'
with open(TFLITE_OUT, 'wb') as f:
    f.write(tflite_model)

tflite_size_mb = os.path.getsize(TFLITE_OUT) / (1024 * 1024)
print(f"TFLite model saved: {TFLITE_OUT} ({tflite_size_mb:.2f} MB)")

# Sanity check: compare Keras vs TFLite predictions on a handful of test images
interpreter = tf.lite.Interpreter(model_path=TFLITE_OUT)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()[0]
output_details = interpreter.get_output_details()[0]

assert output_details['shape'][-1] == len(CLASSES), "TFLite output size doesn't match number of classes!"

mismatches = 0
for path in test_df['filepath'].values[:20]:
    img = tf.keras.utils.load_img(path, target_size=IMG_SIZE)
    arr = preprocess_input(np.expand_dims(tf.keras.utils.img_to_array(img), axis=0)).astype(np.float32)

    keras_pred = np.argmax(model.predict(arr, verbose=0)[0])

    interpreter.set_tensor(input_details['index'], arr)
    interpreter.invoke()
    tflite_pred = np.argmax(interpreter.get_tensor(output_details['index'])[0])

    if keras_pred != tflite_pred:
        mismatches += 1

print(f"Keras vs TFLite prediction mismatches on 20 test images: {mismatches}")
assert mismatches == 0, "TFLite conversion changed predictions — investigate before deploying!"
print("TFLite model matches Keras predictions. Safe to deploy.")

# %% [markdown]
# ## 11. Download everything
#
# Downloads the trained Keras model, the quantized TFLite model, and a zip of every
# report artifact (`report_outputs/`: training curves, classification report, confusion
# matrix, ROC curves, sample predictions, model stats).

# %%
shutil.make_archive('report_outputs', 'zip', 'report_outputs')

try:
    from google.colab import files
    files.download(MODEL_OUT)
    files.download(TFLITE_OUT)
    files.download('report_outputs.zip')
except ImportError:
    print("Not running in Colab — files are saved locally:")
    print(f"  {os.path.abspath(MODEL_OUT)}")
    print(f"  {os.path.abspath(TFLITE_OUT)}")
    print(f"  {os.path.abspath('report_outputs.zip')}")

# %% [markdown]
# ## 12. Deploying the retrained model
#
# To put the new model into `alpha_eye_api`:
#
# 1. Replace `alpha_eye_api/best_odir_model.tflite` with the downloaded `best_cataract_model.tflite`
#    (or update `MODEL_PATH` in `app.py` to point at the new filename).
# 2. Double-check `app.py`'s `CLASSES`/`STAGE_KEYS` order still matches `train_generator.class_indices`
#    printed in Section 5 above (`['Mild Cataract', 'Moderate Cataract', 'Normal Eye']`) — a mismatched
#    order will silently mislabel predictions.
# 3. Keep `alpha_eye_api/best_odir_model.keras` / `.tflite` (the old ODIR-trained files) around until
#    you've confirmed the new model performs well, in case you need to roll back.
#

