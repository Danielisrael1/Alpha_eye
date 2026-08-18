import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, StageColors, Spacing, FontSizes } from '../constants/Colors';
import { addScreening } from '../services/database';

export default function ResultsScreen() {
  const router = useRouter();
  const { scanData } = useLocalSearchParams();
  const result = scanData ? JSON.parse(scanData) : null;

  if (!result) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No scan data available.</Text>
      </View>
    );
  }

  const stageColor = StageColors[result.stageKey] || StageColors.NORMAL;
  const isSevere = result.stageKey === 'SEVERE' || result.stageKey === 'MODERATE';

  const handleSaveToHistory = async () => {
    try {
      const record = {
        id: result.id || 'SCR-' + Date.now(),
        patientId: 'UG-FIELD-' + Math.floor(1000 + Math.random() * 9000),
        patientName: result.patientName || 'Field Screening',
        age: null,
        gender: null,
        location: 'Field Screening — Kampala',
        vhtName: 'Mobile App User',
        date: result.date || new Date().toISOString().split('T')[0],
        eyeSide: result.eyeSide || 'Not specified',
        imageUrl: result.imageUri || '',
        eyeImageUrl: result.imageUri || '',
        diagnosis: result.diagnosis,
        stageKey: result.stageKey,
        confidenceScore: result.confidenceScore,
        status: 'Pending Verification',
        doctorNotes: '',
        assignedHospital: isSevere ? 'Mengo Hospital Eye Dept' : 'N/A',
      };
      await addScreening(record);
      Alert.alert('Saved', 'Screening result saved to history successfully.', [
        { text: 'View History', onPress: () => router.replace('/(tabs)/history') },
        { text: 'OK' },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to save screening. Please check your connection.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Diagnosis Header */}
      <View style={[styles.diagnosisCard, { borderColor: stageColor.dot }]}>
        <View style={[styles.diagnosisDot, { backgroundColor: stageColor.dot }]} />
        <Text style={styles.diagnosisLabel}>AI Diagnosis</Text>
        <Text style={[styles.diagnosisTitle, { color: stageColor.dot }]}>{result.diagnosis}</Text>
        <View style={[styles.confidenceBadge, { backgroundColor: stageColor.bg }]}>
          <Text style={[styles.confidenceText, { color: stageColor.text }]}>
            Confidence: {result.confidenceScore}%
          </Text>
        </View>
      </View>

      {/* Description */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Clinical Description</Text>
        <Text style={styles.sectionBody}>{result.description}</Text>
      </View>

      {/* Recommendation */}
      <View style={[styles.sectionCard, isSevere && styles.urgentCard]}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name={isSevere ? 'warning' : 'checkmark-circle'}
            size={20}
            color={isSevere ? Colors.danger : Colors.success}
          />
          <Text style={styles.sectionTitle}>Recommendation</Text>
        </View>
        <Text style={styles.sectionBody}>{result.recommendation}</Text>
      </View>

      {/* AI Metrics */}
      {result.metrics && (
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>AI Model Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricRow label="Lens Clarity Index" value={`${result.metrics.lensClarityIndex}%`} />
            <MetricRow label="Pupil Symmetry" value={`${result.metrics.pupilSymmetryScore}%`} />
            <MetricRow label="Nuclear Opacity" value={result.metrics.nuclearOpacityGrade} />
            <MetricRow label="Cortical Opacification" value={result.metrics.corticalOpacification} />
            <MetricRow label="Processing Time" value={`${result.metrics.processingTimeMs}ms`} />
          </View>
          <View style={styles.modelTag}>
            <Ionicons name="hardware-chip" size={14} color={Colors.textMuted} />
            <Text style={styles.modelTagText}>{result.aiModel || 'MobileNetV2 v2.4'}</Text>
          </View>
        </View>
      )}

      {/* Scan Info */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Scan Information</Text>
        <MetricRow label="Eye Side" value={result.eyeSide || 'Not specified'} />
        <MetricRow label="Date" value={result.date || result.timestamp || 'N/A'} />
        <MetricRow label="Scan ID" value={result.id || 'N/A'} />
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveToHistory}>
          <Ionicons name="save" size={18} color="#ffffff" />
          <Text style={styles.saveBtnText}>Save to History</Text>
        </TouchableOpacity>

        {isSevere && (
          <TouchableOpacity style={styles.referralBtn} onPress={() => router.push('/facilities')}>
            <Ionicons name="navigate" size={18} color={Colors.danger} />
            <Text style={styles.referralBtnText}>Find Referral Clinic</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function MetricRow({ label, value }) {
  return (
    <View style={styles.metricRow}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: FontSizes.md, color: Colors.textMuted },

  diagnosisCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  diagnosisDot: { width: 14, height: 14, borderRadius: 7, marginBottom: Spacing.sm },
  diagnosisLabel: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  diagnosisTitle: { fontSize: FontSizes.xxl, fontWeight: '800', marginBottom: Spacing.md },
  confidenceBadge: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, borderRadius: 10 },
  confidenceText: { fontSize: FontSizes.md, fontWeight: '700' },

  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  urgentCard: { borderWidth: 1, borderColor: '#fecaca' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  sectionTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  sectionBody: { fontSize: FontSizes.sm, color: Colors.textSecondary, lineHeight: 22 },

  metricsGrid: { marginTop: Spacing.sm },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  metricLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, fontWeight: '500' },
  metricValue: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: '700' },

  modelTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
  },
  modelTagText: { fontSize: FontSizes.xs, color: Colors.textMuted },

  actions: { gap: Spacing.md, marginTop: Spacing.md },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
  },
  saveBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: '#ffffff' },
  referralBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.dangerLight,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  referralBtnText: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.danger },
});
