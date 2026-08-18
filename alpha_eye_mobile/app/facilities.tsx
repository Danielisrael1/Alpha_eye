import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../constants/Colors';
import { fetchFacilities } from '../services/database';

export default function FacilitiesScreen() {
  const [facilities, setFacilities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFacilities();
        setFacilities(data);
      } catch (err) {
        console.error('Error loading facilities:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone.replace(/\s/g, '')}`);
  };

  const handleDirections = (facility) => {
    const coords = facility.coordinates;
    if (coords) {
      const lat = coords.lat;
      const lng = coords.lng;
      const url = Platform.select({
        ios: `maps:0,0?q=${lat},${lng}`,
        android: `geo:${lat},${lng}?q=${lat},${lng}(${facility.name})`,
      });
      Linking.openURL(url);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.infoText}>{item.location}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="navigate-outline" size={16} color={Colors.primary} />
        <Text style={[styles.infoText, { color: Colors.primary, fontWeight: '600' }]}>{item.distance} away</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="medical-outline" size={16} color={Colors.success} />
        <Text style={styles.infoText}>Surgical Capacity: {item.surgicalCapacity}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.callBtn} onPress={() => handleCall(item.phone)}>
          <Ionicons name="call" size={16} color={Colors.primary} />
          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dirBtn} onPress={() => handleDirections(item)}>
          <Ionicons name="navigate" size={16} color="#ffffff" />
          <Text style={styles.dirBtnText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading nearby facilities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={facilities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Ionicons name="location" size={18} color={Colors.primary} />
            <Text style={styles.headerText}>
              Showing {facilities.length} partner eye care centers in Kampala & Wakiso
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="location-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No Facilities Found</Text>
            <Text style={styles.emptyDesc}>Check your connection and try again.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
  },
  headerText: { fontSize: FontSizes.sm, color: Colors.primary, fontWeight: '600', flex: 1 },
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
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: { fontSize: FontSizes.xs, fontWeight: '700', color: Colors.primary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  statusText: { fontSize: FontSizes.xs, fontWeight: '600', color: Colors.success },
  name: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  infoText: { fontSize: FontSizes.sm, color: Colors.textSecondary, flex: 1 },
  cardActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  callBtnText: { fontSize: FontSizes.sm, fontWeight: '700', color: Colors.primary },
  dirBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: Colors.primary,
  },
  dirBtnText: { fontSize: FontSizes.sm, fontWeight: '700', color: '#ffffff' },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: FontSizes.lg, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg },
  emptyDesc: { fontSize: FontSizes.sm, color: Colors.textMuted, marginTop: Spacing.xs },
});
