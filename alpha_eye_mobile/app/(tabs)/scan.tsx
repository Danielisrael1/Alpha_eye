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
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [eyeSide, setEyeSide] = useState('Right Eye');

  // Patient details state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Female' | 'Male'>('Female');
  const [patientLocation, setPatientLocation] = useState('');
  const [vhtName, setVhtName] = useState('');

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
        vhtName: vhtName.trim() || 'Community Screener',
        imageUri: capturedImage,
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].slice(0, 5),
      };
      router.push({ pathname: '/results', params: { scanData: JSON.stringify(scanData) } });
    } catch {
      Alert.alert('Analysis Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setCapturedImage(null);
    }
  };

  // Image preview & patient form screen
  if (capturedImage) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Image source={{ uri: capturedImage }} style={styles.preview} />
        <View style={styles.previewOverlay}>
          <ScrollView contentContainerStyle={styles.formScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.previewTitle}>Patient & Scan Details</Text>
            <Text style={styles.previewSubtitle}>Enter patient details before running AI analysis</Text>

            {/* Patient Name */}
            <Text style={styles.fieldLabel}>Patient Full Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Nakitende Florence"
              placeholderTextColor="#64748b"
              value={patientName}
              onChangeText={setPatientName}
            />

            {/* Age & Gender Row */}
            <View style={styles.formRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Age</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 58"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={patientAge}
                  onChangeText={setPatientAge}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Gender</Text>
                <View style={styles.genderContainer}>
                  {(['Female', 'Male'] as const).map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.genderBtn, patientGender === g && styles.genderBtnActive]}
                      onPress={() => setPatientGender(g)}
                    >
                      <Text style={[styles.genderBtnText, patientGender === g && styles.genderBtnTextActive]}>
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Location */}
            <Text style={styles.fieldLabel}>Location / Division</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Kasubi Division, Kampala"
              placeholderTextColor="#64748b"
              value={patientLocation}
              onChangeText={setPatientLocation}
            />

            {/* VHT Screener Name */}
            <Text style={styles.fieldLabel}>VHT / Screener Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Kiyimba Ronald (VHT #14)"
              placeholderTextColor="#64748b"
              value={vhtName}
              onChangeText={setVhtName}
            />

            {/* Eye Side Selector */}
            <Text style={styles.fieldLabel}>Eye Scanned</Text>
            <View style={styles.eyeSelector}>
              {['Left Eye', 'Right Eye', 'Both Eyes'].map((side) => (
                <TouchableOpacity
                  key={side}
                  style={[styles.eyeOption, eyeSide === side && styles.eyeOptionActive]}
                  onPress={() => setEyeSide(side)}
                >
                  <Text style={[styles.eyeOptionText, eyeSide === side && styles.eyeOptionTextActive]}>
                    {side}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.previewActions}>
              <TouchableOpacity style={styles.retakeBtn} onPress={() => setCapturedImage(null)}>
                <Ionicons name="refresh" size={20} color={Colors.textPrimary} />
                <Text style={styles.retakeBtnText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.analyzeBtn} onPress={runAnalysis} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Ionicons name="pulse" size={20} color="#ffffff" />
                )}
                <Text style={styles.analyzeBtnText}>
                  {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Camera View
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />
      
      <View style={StyleSheet.absoluteFill}>
        {/* Guide overlay */}
        <View style={styles.guideOverlay}>
          <Text style={styles.guideText}>Align the eye within the circle</Text>
          <View style={styles.guideCircle} />
          <Text style={styles.guideHint}>Hold steady · Ensure good lighting</Text>
        </View>

        {/* Bottom controls */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: Spacing.xxl },
  camera: { flex: 1 },
  preview: { flex: 1, resizeMode: 'cover' },

  // Permission UI
  permissionCard: { alignItems: 'center', maxWidth: 320 },
  permissionIcon: {
    width: 80, height: 80, borderRadius: 24,
    backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  permissionTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  permissionDesc: { fontSize: FontSizes.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.xxl },
  permissionBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  permissionBtnText: { color: '#ffffff', fontSize: FontSizes.md, fontWeight: '700' },

  // Camera Guide
  guideOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  guideText: {
    color: '#ffffff', fontSize: FontSizes.md, fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8,
    marginBottom: Spacing.xl,
  },
  guideCircle: {
    width: 240, height: 240, borderRadius: 120,
    borderWidth: 3, borderColor: 'rgba(37, 99, 235, 0.8)',
    borderStyle: 'dashed',
  },
  guideHint: {
    color: 'rgba(255,255,255,0.7)', fontSize: FontSizes.sm, marginTop: Spacing.lg,
  },

  // Camera Controls
  cameraControls: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingVertical: Spacing.xxl, paddingBottom: 48,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  controlBtn: { alignItems: 'center', gap: 4 },
  controlLabel: { color: '#ffffff', fontSize: FontSizes.xs, fontWeight: '600' },
  captureBtn: {
    width: 76, height: 76, borderRadius: 38,
    borderWidth: 4, borderColor: '#ffffff',
    justifyContent: 'center', alignItems: 'center',
  },
  captureBtnInner: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#ffffff',
  },

  // Preview & Analysis
  previewOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    maxHeight: '80%',
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: Spacing.lg, paddingBottom: 32,
  },
  formScroll: { paddingBottom: 16 },
  previewTitle: { fontSize: FontSizes.xl, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  previewSubtitle: { fontSize: FontSizes.sm, color: '#94a3b8', marginBottom: Spacing.md },
  fieldLabel: { fontSize: FontSizes.xs, fontWeight: '700', color: '#cbd5e1', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: FontSizes.sm,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: Spacing.sm,
  },
  formRow: { flexDirection: 'row', gap: Spacing.md },
  genderContainer: { flexDirection: 'row', gap: Spacing.xs, height: 40 },
  genderBtn: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderBtnActive: { borderColor: Colors.primary, backgroundColor: 'rgba(37, 99, 235, 0.25)' },
  genderBtnText: { color: '#94a3b8', fontSize: FontSizes.xs, fontWeight: '600' },
  genderBtnTextActive: { color: '#ffffff', fontWeight: '700' },
  eyeSelector: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg, marginTop: 4 },
  eyeOption: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: 10,
    borderWidth: 1, borderColor: '#475569', alignItems: 'center',
  },
  eyeOptionActive: { borderColor: Colors.primary, backgroundColor: 'rgba(37, 99, 235, 0.25)' },
  eyeOptionText: { color: '#94a3b8', fontSize: FontSizes.sm, fontWeight: '600' },
  eyeOptionTextActive: { color: '#ffffff', fontWeight: '700' },
  previewActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
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
});
