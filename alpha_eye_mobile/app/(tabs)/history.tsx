import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, StageColors, Spacing, FontSizes } from '../../constants/Colors';
import { fetchScreenings } from '../../services/database';

export default function HistoryScreen() {
  const router = useRouter();
  const [screenings, setScreenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await fetchScreenings();
      setScreenings(data);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const stageColor = StageColors[item.stageKey] || StageColors.NORMAL;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: '/results', params: { scanData: JSON.stringify(item) } })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <View style={[styles.stageIndicator, { backgroundColor: stageColor.dot }]} />
            <View>
              <Text style={styles.patientName}>{item.patientName}</Text>
              <Text style={styles.meta}>{item.date} · {item.eyeSide}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </View>

        <View style={styles.cardFooter}>
          <View style={[styles.badge, { backgroundColor: stageColor.bg }]}>
            <Text style={[styles.badgeText, { color: stageColor.text }]}>{item.diagnosis}</Text>
          </View>
          <Text style={styles.confidence}>{item.confidenceScore}%</Text>
        </View>

        {item.status && (
          <View style={styles.statusRow}>
            <View style={[styles.statusBadge,
              item.status === 'Verified' ? styles.statusVerified :
              item.status === 'Referred' ? styles.statusReferred :
              styles.statusPending
            ]}>
              <Text style={[styles.statusText,
                item.status === 'Verified' ? { color: '#065f46' } :
                item.status === 'Referred' ? { color: '#92400e' } :
                { color: '#475569' }
              ]}>
                {item.status}
              </Text>
            </View>
            {item.assignedHospital && item.assignedHospital !== 'N/A' && (
              <Text style={styles.hospitalText} numberOfLines={1}>{item.assignedHospital}</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading screening history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={screenings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Screenings Yet</Text>
            <Text style={styles.emptyDesc}>Capture your first eye scan to see results here.</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/(tabs)/scan')}>
              <Text style={styles.emptyBtnText}>Start Scanning</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.md },
  listContent: { padding: Spacing.lg },
  card: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  stageIndicator: { width: 10, height: 10, borderRadius: 5 },
  patientName: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  meta: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
  },
  badgeText: { fontSize: FontSizes.xs, fontWeight: '700' },
  confidence: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.primary },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusVerified: { backgroundColor: '#d1fae5' },
  statusReferred: { backgroundColor: '#fef3c7' },
  statusPending: { backgroundColor: '#f1f5f9' },
  statusText: { fontSize: FontSizes.xs, fontWeight: '600' },
  hospitalText: { fontSize: FontSizes.xs, color: Colors.textMuted, flex: 1 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg },
  emptyDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  emptyBtn: { backgroundColor: Colors.primary, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md, borderRadius: 12 },
  emptyBtnText: { color: '#ffffff', fontSize: FontSizes.md, fontWeight: '700' },
});
