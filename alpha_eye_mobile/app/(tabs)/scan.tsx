import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';
import { analyzeEyeScan } from '../../services/aiClassifier';

export default function ScanScreen() {
  const router = useRouter();
  const cameraRef = useRef<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');

  // Step state: 'patient_info' (Step 1) -> 'camera_scan' (Step 2)
  const [step, setStep] = useState<'patient_info' | 'camera_scan'>('patient_info');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [eyeSide, setEyeSide] = useState('Right Eye');

  // Patient details state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Female' | 'Male'>('Female');
  const [patientLocation, setPatientLocation] = useState('Kasubi Division, Kampala');
  const [vhtName, setVhtName] = useState('Kiyimba Ronald (VHT #14)');

  const handleProceedToCamera = () => {
    if (!patientName.trim()) {
      Alert.alert('Patient Name Required', 'Please enter the patient full name before proceeding to eye camera scan.');
      return;
    }
    setStep('camera_scan');
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        setCapturedImage(photo.uri);
      } catch {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const runAnalysis = async () => {
    if (!capturedImage) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeEyeScan(capturedImage);
      const scanData = {
        ...result,
        eyeSide,
        patientName: patientName.trim() || 'Anonymous Patient',
        age: patientAge.trim() ? parseInt(patientAge.trim(), 10) : null,
        gender: patientGender,
        location: patientLocation.trim() || 'Kampala District',
        vhtName: vhtName.trim() || 'VHT Health Screener',
        imageUri: capturedImage,
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5),
      };
      router.push({ pathname: '/results', params: { scanData: JSON.stringify(scanData) } });
    } catch {
      Alert.alert('Analysis Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setCapturedImage(null);
      setStep('patient_info');
    }
  };

  // STEP 1: PATIENT INFORMATION ENTRY (VHT ENTERS FIRST)
  if (step === 'patient_info') {
    return (
      <KeyboardAvoidingView
        style={styles.containerLight}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.headerCard}>
            <View style={styles.headerIconBg}>
              <Ionicons name="person-add" size={24} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>Step 1: Patient Registration</Text>
              <Text style={styles.headerSubtitle}>Enter patient & VHT details before taking eye scan</Text>
            </View>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Patient Name */}
            <Text style={styles.inputLabel}>Patient Full Name *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Nakitende Florence"
              placeholderTextColor="#94a3b8"
              value={patientName}
              onChangeText={setPatientName}
            />

            {/* Age & Gender Row */}
            <View style={styles.rowTwo}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Age (Years)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g. 58"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={patientAge}
                  onChangeText={setPatientAge}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderRow}>
                  {(['Female', 'Male'] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderChip, patientGender === g && styles.genderChipActive]}
                      onPress={() => setPatientGender(g)}
                    >
                      <Text style={[styles.genderChipText, patientGender === g && styles.genderChipTextActive]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Location */}
            <Text style={styles.inputLabel}>Division / Parish Location</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Kasubi Division, Kampala"
              placeholderTextColor="#94a3b8"
              value={patientLocation}
              onChangeText={setPatientLocation}
            />

            {/* VHT Screener Name */}
            <Text style={styles.inputLabel}>VHT / Screener Name</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Kiyimba Ronald (VHT #14)"
              placeholderTextColor="#94a3b8"
              value={vhtName}
              onChangeText={setVhtName}
            />

            {/* Affected Eye */}
            <Text style={styles.inputLabel}>Eye to be Scanned</Text>
            <View style={styles.eyeRow}>
              {['Right Eye', 'Left Eye', 'Both Eyes'].map((side) => (
                <TouchableOpacity
                  key={side}
                  style={[styles.eyeChip, eyeSide === side && styles.eyeChipActive]}
                  onPress={() => setEyeSide(side)}
                >
                  <Text style={[styles.eyeChipText, eyeSide === side && styles.eyeChipTextActive]}>
                    {side}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.proceedBtn} onPress={handleProceedToCamera}>
              <Text style={styles.proceedBtnText}>Proceed to Eye Camera Scan</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Camera permissions check for Step 2
  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Ionicons name="camera" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionDesc}>
            Alpha Eye needs camera access to capture eye images for AI-powered cataract screening.
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
            <Text style={styles.permissionBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // STEP 2: CAMERA CAPTURE / IMAGE PREVIEW
  return (
    <View style={styles.containerDark}>
      {/* Patient Header Banner */}
      <View style={styles.patientBanner}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setStep('patient_info')}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerName}>{patientName || 'Anonymous Patient'}</Text>
          <Text style={styles.bannerMeta}>{patientGender} · {patientAge ? `${patientAge} yrs` : 'Age N/A'} · {eyeSide}</Text>
        </View>
        <TouchableOpacity style={styles.editInfoBtn} onPress={() => setStep('patient_info')}>
          <Text style={styles.editInfoText}>Edit Info</Text>
        </TouchableOpacity>
      </View>

      {capturedImage ? (
        // Image Preview State
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.previewImage} />
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.retakeBtn} onPress={() => setCapturedImage(null)}>
              <Ionicons name="refresh" size={20} color={Colors.textPrimary} />
              <Text style={styles.retakeBtnText}>Retake Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.analyzeBtn} onPress={runAnalysis} disabled={isAnalyzing}>
              {isAnalyzing ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Ionicons name="pulse" size={20} color="#ffffff" />
              )}
              <Text style={styles.analyzeBtnText}>
                {isAnalyzing ? 'Analyzing...' : 'Run Diagnostic AI'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Active Camera State
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={StyleSheet.absoluteFill}>
            <View style={styles.guideOverlay}>
              <Text style={styles.guideText}>Align patient&apos;s {eyeSide} in circle</Text>
              <View style={styles.guideCircle} />
              <Text style={styles.guideHint}>Hold steady · Ensure good ambient light</Text>
            </View>

            <View style={styles.cameraControls}>
              <TouchableOpacity style={styles.controlBtn} onPress={pickImage}>
                <Ionicons name="images" size={24} color="#ffffff" />
                <Text style={styles.controlLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
                <View style={styles.captureBtnInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
              >
                <Ionicons name="camera-reverse" size={24} color="#ffffff" />
                <Text style={styles.controlLabel}>Flip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerLight: { flex: 1, backgroundColor: Colors.background },
  containerDark: { flex: 1, backgroundColor: '#000000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: Spacing.xxl },
  scrollContent: { padding: Spacing.lg },

  // Step 1 Header & Form
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    padding: Spacing.lg,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  headerIconBg: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  headerSubtitle: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },

  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  rowTwo: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xs },
  genderRow: { flexDirection: 'row', gap: Spacing.xs, height: 46 },
  genderChip: {
    flex: 1, borderRadius: 10, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background,
  },
  genderChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  genderChipText: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600' },
  genderChipTextActive: { color: Colors.primary, fontWeight: '700' },

  eyeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xxl },
  eyeChip: {
    flex: 1, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border, alignItems: 'center', backgroundColor: Colors.background,
  },
  eyeChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  eyeChipText: { color: Colors.textSecondary, fontSize: FontSizes.xs, fontWeight: '600' },
  eyeChipTextActive: { color: Colors.primary, fontWeight: '700' },

  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  proceedBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: '#ffffff' },

  // Step 2 Banner & Camera
  patientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 54 : Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: '#0f172a',
    gap: Spacing.md,
  },
  backBtn: { padding: 4 },
  bannerName: { fontSize: FontSizes.md, fontWeight: '700', color: '#ffffff' },
  bannerMeta: { fontSize: FontSizes.xs, color: '#94a3b8', marginTop: 1 },
  editInfoBtn: { backgroundColor: '#1e293b', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  editInfoText: { fontSize: FontSizes.xs, color: Colors.primary, fontWeight: '600' },

  camera: { flex: 1 },
  guideOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  guideText: {
    color: '#ffffff', fontSize: FontSizes.md, fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
    marginBottom: Spacing.xl,
  },
  guideCircle: {
    width: 240, height: 240, borderRadius: 120,
    borderWidth: 3, borderColor: 'rgba(37, 99, 235, 0.8)',
    borderStyle: 'dashed',
  },
  guideHint: { color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm, marginTop: Spacing.lg },

  cameraControls: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: Spacing.xxl, paddingBottom: 48,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  controlBtn: { alignItems: 'center', gap: 4 },
  controlLabel: { color: '#ffffff', fontSize: FontSizes.xs, fontWeight: '600' },
  captureBtn: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 4, borderColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center',
  },
  captureBtnInner: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffffff' },

  previewContainer: { flex: 1, backgroundColor: '#000000' },
  previewImage: { flex: 1, resizeMode: 'contain' },
  previewControls: {
    flexDirection: 'row',
    gap: Spacing.md,
    padding: Spacing.xl,
    paddingBottom: 48,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
  },
  retakeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: '#f1f5f9', paddingVertical: 14, borderRadius: 12,
  },
  retakeBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  analyzeBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: 12,
  },
  analyzeBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: '#ffffff' },

  permissionCard: { alignItems: 'center', maxWidth: 320 },
  permissionIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  permissionTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  permissionDesc: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xxl },
  permissionBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: 12 },
  permissionBtnText: { color: '#ffffff', fontSize: FontSizes.md, fontWeight: '700' },
});
