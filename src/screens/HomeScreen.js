import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, HeartIcon } from '../components';
import { THEME } from '../constants/theme';
import { getScanHistory, getHealthMetrics } from '../utils/storage';
import { formatDate } from '../utils/healthMetrics';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }) => {
  const [recentScans, setRecentScans] = useState([]);
  const [stats, setStats] = useState({
    totalScans: 0,
    thisWeek: 0,
    lastScan: null,
  });

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const scans = await getScanHistory();
    const metrics = await getHealthMetrics();
    
    setRecentScans(scans.slice(0, 3));
    
    // Calculate stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeekScans = scans.filter(scan => new Date(scan.timestamp) > weekAgo);
    
    setStats({
      totalScans: scans.length,
      thisWeek: thisWeekScans.length,
      lastScan: scans[0]?.timestamp || null,
    });
  };

  const handleQuickAction = (action) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(action);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Section */}
      <Card style={styles.heroCard}>
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Your Heart Health</Text>
            <Text style={styles.heroSubtitle}>AI-Powered Monitoring</Text>
          </View>
          <HeartIcon size={80} color={THEME.colors.primary} />
        </View>
      </Card>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Ionicons name="document-text" size={32} color={THEME.colors.primary} />
          <Text style={styles.statNumber}>{stats.totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Ionicons name="trending-up" size={32} color={THEME.colors.success} />
          <Text style={styles.statNumber}>{stats.thisWeek}</Text>
          <Text style={styles.statLabel}>This Week</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <Ionicons name="time" size={32} color={THEME.colors.info} />
          <Text style={styles.statNumber}>
            {stats.lastScan ? formatDate(stats.lastScan).split(',')[0] : 'N/A'}
          </Text>
          <Text style={styles.statLabel}>Last Scan</Text>
        </Card>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: THEME.colors.primary }]}
            onPress={() => handleQuickAction('Scan')}
            activeOpacity={0.8}
          >
            <Ionicons name="scan" size={40} color={THEME.colors.textWhite} />
            <Text style={styles.actionTitle}>Scan Report</Text>
            <Text style={styles.actionSubtitle}>Analyze medical documents</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: THEME.colors.secondary }]}
            onPress={() => handleQuickAction('Chat')}
            activeOpacity={0.8}
          >
            <Ionicons name="chatbubbles" size={40} color={THEME.colors.textWhite} />
            <Text style={styles.actionTitle}>AI Assistant</Text>
            <Text style={styles.actionSubtitle}>Ask health questions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Scans */}
      {recentScans.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Scans</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentScans.map((scan) => (
            <Card key={scan.id} style={styles.scanCard}>
              <View style={styles.scanHeader}>
                <Ionicons name="document-text-outline" size={24} color={THEME.colors.primary} />
                <View style={styles.scanInfo}>
                  <Text style={styles.scanDate}>{formatDate(scan.timestamp)}</Text>
                  <Text style={styles.scanSummary} numberOfLines={2}>
                    {scan.summary || 'Medical report analysis'}
                  </Text>
                </View>
                <View style={[styles.urgencyBadge, { backgroundColor: scan.urgency === 'Low' ? THEME.colors.success : THEME.colors.warning }]}>
                  <Text style={styles.urgencyText}>{scan.urgency || 'N/A'}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Health Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Tips</Text>
        
        <Card style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={24} color={THEME.colors.warning} />
            <Text style={styles.tipTitle}>Daily Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Regular cardiovascular exercise for 30 minutes a day can significantly reduce your risk of heart disease. Start with a brisk walk!
          </Text>
        </Card>

        <Card style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Ionicons name="restaurant" size={24} color={THEME.colors.success} />
            <Text style={styles.tipTitle}>Nutrition Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Include omega-3 rich foods like salmon, walnuts, and flaxseeds in your diet to support heart health.
          </Text>
        </Card>
      </View>

      {/* Emergency Info */}
      <Card style={styles.emergencyCard}>
        <View style={styles.emergencyHeader}>
          <Ionicons name="alert-circle" size={28} color={THEME.colors.error} />
          <Text style={styles.emergencyTitle}>Emergency?</Text>
        </View>
        <Text style={styles.emergencyText}>
          If you're experiencing chest pain, severe shortness of breath, or other serious symptoms, call emergency services immediately.
        </Text>
        <TouchableOpacity style={styles.emergencyButton}>
          <Ionicons name="call" size={20} color={THEME.colors.textWhite} />
          <Text style={styles.emergencyButtonText}>Call 108</Text>
        </TouchableOpacity>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  content: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xl,
  },
  
  // Hero Section
  heroCard: {
    marginBottom: THEME.spacing.lg,
    backgroundColor: THEME.colors.primaryLight,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontSize: THEME.fonts.sizes.xxxl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textWhite,
    marginBottom: THEME.spacing.xs,
  },
  heroSubtitle: {
    fontSize: THEME.fonts.sizes.lg,
    color: THEME.colors.textWhite,
    opacity: 0.9,
  },
  
  // Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: THEME.spacing.md,
  },
  statNumber: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textPrimary,
    marginTop: THEME.spacing.xs,
  },
  statLabel: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
  },
  
  // Sections
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textPrimary,
  },
  seeAll: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.primary,
    fontWeight: THEME.fonts.weights.medium,
  },
  
  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: THEME.borderRadius.lg,
    padding: THEME.spacing.lg,
    alignItems: 'center',
    ...THEME.shadows.medium,
  },
  actionTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textWhite,
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textWhite,
    opacity: 0.9,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
  },
  
  // Recent Scans
  scanCard: {
    marginBottom: THEME.spacing.sm,
  },
  scanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanInfo: {
    flex: 1,
    marginLeft: THEME.spacing.md,
  },
  scanDate: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
    marginBottom: THEME.spacing.xs,
  },
  scanSummary: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
  },
  urgencyBadge: {
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.round,
  },
  urgencyText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.textWhite,
    fontWeight: THEME.fonts.weights.semibold,
  },
  
  // Health Tips
  tipCard: {
    marginBottom: THEME.spacing.sm,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  tipTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginLeft: THEME.spacing.sm,
  },
  tipText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textSecondary,
    lineHeight: 22,
  },
  
  // Emergency
  emergencyCard: {
    backgroundColor: '#FFF5F5',
    borderLeftWidth: 4,
    borderLeftColor: THEME.colors.error,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  emergencyTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.error,
    marginLeft: THEME.spacing.sm,
  },
  emergencyText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
    lineHeight: 22,
    marginBottom: THEME.spacing.md,
  },
  emergencyButton: {
    backgroundColor: THEME.colors.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
  },
  emergencyButtonText: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textWhite,
    marginLeft: THEME.spacing.sm,
  },
});
