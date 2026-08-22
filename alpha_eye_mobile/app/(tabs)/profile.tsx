import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '../../constants/Colors';

import type { ComponentProps } from 'react';

interface MenuItem {
  title: string;
  subtitle: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  iconBg: string;
  iconColor: string;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    title: 'Find Nearby Eye Clinics',
    subtitle: 'Locate partner hospitals & referral centers',
    icon: 'location',
    iconBg: '#dbeafe',
    iconColor: Colors.primary,
    route: '/facilities',
  },
  {
    title: 'AI Health Assistant',
    subtitle: 'Ask questions about cataracts & eye health',
    icon: 'chatbubbles',
    iconBg: '#f3e8ff',
    iconColor: '#7c3aed',
    route: '/chatbot',
  },
  {
    title: 'Screening History',
    subtitle: 'View all past screening results',
    icon: 'time',
    iconBg: '#d1fae5',
    iconColor: Colors.success,
    route: '/(tabs)/history',
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* App Info Card */}
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.infoCard}
      >
        <View style={styles.appIconRow}>
          <View style={styles.appIcon}>
            <Ionicons name="eye" size={24} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.appName}>Alpha Eye</Text>
            <Text style={styles.appVersion}>v1.0.0 — Prototype Build</Text>
          </View>
        </View>
        <Text style={styles.appDesc}>
          Cloud-Based AI System for Early Cataract Detection. Designed for community health workers
          and patients in Kampala & Wakiso District.
        </Text>
      </LinearGradient>

      {/* Menu Items */}
      <Text style={styles.sectionTitle}>Features</Text>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuCard}
          onPress={() => router.push(item.route as any)}
        >
          <View style={[styles.menuIcon, { backgroundColor: item.iconBg }]}>
            <Ionicons name={item.icon} size={22} color={item.iconColor} />
          </View>
          <View style={styles.menuInfo}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      ))}

      {/* Project Info */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.aboutCard}>
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Project</Text>
          <Text style={styles.aboutValue}>BSc. Computer Science — Final Year</Text>
        </View>
        <View style={styles.aboutDivider} />
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Developer</Text>
          <Text style={styles.aboutValue}>Lukwago Daniel</Text>
        </View>
        <View style={styles.aboutDivider} />
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>Supervisor</Text>
          <Text style={styles.aboutValue}>Ms. Musiime Phionah</Text>
        </View>
        <View style={styles.aboutDivider} />
        <View style={styles.aboutRow}>
          <Text style={styles.aboutLabel}>AI Model</Text>
          <Text style={styles.aboutValue}>MobileNetV2 (Transfer Learning)</Text>
        </View>
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle" size={16} color={Colors.textMuted} />
        <Text style={styles.disclaimerText}>
          This is a prototype screening tool for educational purposes. It is not a substitute for
          professional medical diagnosis.
        </Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.lg },
  infoCard: {
    backgroundColor: Colors.dark,
    borderRadius: 16,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  appIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: { fontSize: FontSizes.xl, fontWeight: '800', color: '#ffffff' },
  appVersion: { fontSize: FontSizes.xs, color: '#94a3b8', marginTop: 1 },
  appDesc: { fontSize: FontSizes.sm, color: '#94a3b8', lineHeight: 20 },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  menuInfo: { flex: 1 },
  menuTitle: { fontSize: FontSizes.md, fontWeight: '700', color: Colors.textPrimary },
  menuSubtitle: { fontSize: FontSizes.xs, color: Colors.textMuted, marginTop: 2 },
  aboutCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  aboutDivider: { height: 1, backgroundColor: Colors.borderLight },
  aboutLabel: { fontSize: FontSizes.sm, color: Colors.textMuted, fontWeight: '600' },
  aboutValue: { fontSize: FontSizes.sm, color: Colors.textPrimary, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: Spacing.lg },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    padding: Spacing.lg,
    backgroundColor: '#fefce8',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fef08a',
  },
  disclaimerText: { flex: 1, fontSize: FontSizes.xs, color: '#92400e', lineHeight: 18 },
});
