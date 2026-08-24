import os
import tensorflow as tf
import keras

print("Loading Keras model best_odir_model.keras...")
model_path = '/Users/daniel/Downloads/best_odir_model.keras'
model = keras.saving.load_model(model_path, compile=False)
print("Model loaded successfully!")

print("Converting model to TensorFlow Lite (.tflite) format...")
converter = tf.lite.TFLiteConverter.from_keras_model(model)
converter.optimizations = [tf.lite.Optimize.DEFAULT]
tflite_model = converter.convert()

output_dir = '/Users/daniel/Desktop/school/final year pjt/alpha_eye_mobile/assets/models'
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'cataract_model.tflite')

with open(output_path, 'wb') as f:
    f.write(tflite_model)

size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"SUCCESS! Quantized TFLite model saved to: {output_path} ({size_mb:.2f} MB)")
