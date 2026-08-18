import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, StageColors, Spacing, FontSizes } from '../../constants/Colors';
import { fetchScreenings } from '../../services/database';

export default function HomeScreen() {
  const router = useRouter();
  const [screenings, setScreenings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchScreenings();
      setScreenings(data);
    } catch (err) {
      console.error('Error loading screenings:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalScans = screenings.length;
  const pendingCount = screenings.filter((s) => s.status === 'Pending Verification').length;
  const severeCount = screenings.filter((s) => s.stageKey === 'SEVERE').length;
  const latestScan = screenings[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
    >
      {/* Hero Welcome */}
      <View style={styles.heroCard}>
        <View style={styles.heroIcon}>
          <Ionicons name="eye" size={28} color="#ffffff" />
        </View>
        <Text style={styles.heroTitle}>Alpha Eye</Text>
        <Text style={styles.heroSubtitle}>
          AI-Powered Cataract Screening for Kampala & Wakiso District
        </Text>
        <TouchableOpacity style={styles.heroBtn} onPress={() => router.push('/(tabs)/scan')}>
          <Ionicons name="scan-circle" size={20} color="#ffffff" />
          <Text style={styles.heroBtnText}>Start New Eye Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <Text style={styles.sectionTitle}>Dashboard Overview</Text>
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { borderLeftColor: Colors.primary }]}>
          <Text style={styles.statValue}>{totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: Colors.warning }]}>
          <Text style={styles.statValue}>{pendingCount}</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: Colors.danger }]}>
          <Text style={styles.statValue}>{severeCount}</Text>
          <Text style={styles.statLabel}>Severe</Text>
        </View>
      </View>

      {/* Latest Result */}
      {latestScan && (
        <>
          <Text style={styles.sectionTitle}>Latest Screening</Text>
          <TouchableOpacity
            style={styles.latestCard}
            onPress={() => router.push({ pathname: '/results', params: { scanData: JSON.stringify(latestScan) } })}
          >
            <View style={styles.latestHeader}>
              <View>
                <Text style={styles.latestName}>{latestScan.patientName}</Text>
                <Text style={styles.latestMeta}>{latestScan.date} · {latestScan.eyeSide}</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: StageColors[latestScan.stageKey]?.bg || '#f1f5f9' }]}>
                <View style={[styles.badgeDot, { backgroundColor: StageColors[latestScan.stageKey]?.dot || '#94a3b8' }]} />
                <Text style={[styles.badgeText, { color: StageColors[latestScan.stageKey]?.text || '#475569' }]}>
                  {latestScan.diagnosis}
                </Text>
              </View>
            </View>
            <View style={styles.latestFooter}>
              <Text style={styles.confidenceLabel}>
                AI Confidence: <Text style={styles.confidenceValue}>{latestScan.confidenceScore}%</Text>
              </Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </View>
          </TouchableOpacity>
        </>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/facilities')}>
          <View style={[styles.actionIcon, { backgroundColor: '#dbeafe' }]}>
            <Ionicons name="location" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.actionLabel}>Find Clinics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/chatbot')}>
          <View style={[styles.actionIcon, { backgroundColor: '#f3e8ff' }]}>
            <Ionicons name="chatbubbles" size={22} color="#7c3aed" />
          </View>
          <Text style={styles.actionLabel}>AI Chatbot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(tabs)/history')}>
          <View style={[styles.actionIcon, { backgroundColor: '#d1fae5' }]}>
            <Ionicons name="time" size={22} color={Colors.success} />
          </View>
          <Text style={styles.actionLabel}>History</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  heroCard: {
    backgroundColor: Colors.dark,
    borderRadius: 20,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  heroTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: Spacing.xs,
  },
  heroSubtitle: {
    fontSize: FontSizes.sm,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  heroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  heroBtnText: {
    color: '#ffffff',
    fontSize: FontSizes.md,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  latestCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    marginBottom: Spacing.xxl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  latestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  latestName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  latestMeta: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    gap: 5,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: FontSizes.xs,
    fontWeight: '700',
  },
  latestFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.md,
  },
  confidenceLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  confidenceValue: {
    fontWeight: '700',
    color: Colors.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
