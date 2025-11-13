import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components';
import { THEME } from '../constants/theme';
import { getScanHistory, deleteScanResult, clearScanHistory } from '../utils/storage';
import { formatDate, formatTime } from '../utils/healthMetrics';
import { getUrgencyColor } from '../services/visionService';

export const HistoryScreen = ({ navigation }) => {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  const loadHistory = async () => {
    setRefreshing(true);
    const data = await getScanHistory();
    setHistory(data);
    setRefreshing(false);
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Scan',
      'Are you sure you want to delete this scan result?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteScanResult(id);
            loadHistory();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all scan history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearScanHistory();
            loadHistory();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <Card style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color={THEME.colors.textSecondary} />
          <Text style={styles.dateText}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color={THEME.colors.error} />
        </TouchableOpacity>
      </View>

      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      )}

      <View style={styles.cardContent}>
        <View style={styles.urgencyRow}>
          <Text style={styles.urgencyLabel}>Urgency:</Text>
          <View style={[styles.urgencyBadge, { backgroundColor: getUrgencyColor(item.urgency) }]}>
            <Text style={styles.urgencyText}>{item.urgency || 'N/A'}</Text>
          </View>
        </View>

        {item.summary && (
          <Text style={styles.summary} numberOfLines={3}>
            {item.summary}
          </Text>
        )}

        {item.riskFactors && item.riskFactors.length > 0 && (
          <View style={styles.riskSection}>
            <Text style={styles.sectionTitle}>Risk Factors:</Text>
            {item.riskFactors.slice(0, 2).map((risk, index) => (
              <View key={index} style={styles.riskItem}>
                <View style={styles.bullet} />
                <Text style={styles.riskText} numberOfLines={1}>{risk}</Text>
              </View>
            ))}
            {item.riskFactors.length > 2 && (
              <Text style={styles.moreText}>+{item.riskFactors.length - 2} more</Text>
            )}
          </View>
        )}
      </View>
    </Card>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="document-text-outline" size={80} color={THEME.colors.textLight} />
      <Text style={styles.emptyTitle}>No Scan History</Text>
      <Text style={styles.emptyText}>
        Your scanned medical reports will appear here
      </Text>
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate('Scan')}
      >
        <Ionicons name="scan" size={20} color={THEME.colors.textWhite} />
        <Text style={styles.scanButtonText}>Scan Your First Report</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {history.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{history.length} Scan{history.length !== 1 ? 's' : ''}</Text>
          <TouchableOpacity onPress={handleClearAll} style={styles.clearAllButton}>
            <Ionicons name="trash-outline" size={18} color={THEME.colors.error} />
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        refreshing={refreshing}
        onRefresh={loadHistory}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.md,
    backgroundColor: THEME.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.border,
  },
  headerTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  clearAllText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.error,
    fontWeight: THEME.fonts.weights.medium,
  },
  listContent: {
    padding: THEME.spacing.md,
    paddingBottom: THEME.spacing.xxl,
  },
  historyCard: {
    marginBottom: THEME.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.xs,
  },
  dateText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  timeText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.textLight,
  },
  deleteButton: {
    padding: THEME.spacing.xs,
  },
  thumbnail: {
    width: '100%',
    height: 150,
    borderRadius: THEME.borderRadius.md,
    backgroundColor: THEME.colors.border,
    marginBottom: THEME.spacing.sm,
  },
  cardContent: {
    gap: THEME.spacing.sm,
  },
  urgencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  urgencyLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
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
  summary: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
    lineHeight: 20,
  },
  riskSection: {
    marginTop: THEME.spacing.xs,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.xs,
  },
  riskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.warning,
    marginRight: THEME.spacing.xs,
  },
  riskText: {
    flex: 1,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  moreText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.primary,
    fontStyle: 'italic',
    marginTop: THEME.spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: THEME.spacing.xxl * 2,
  },
  emptyTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textPrimary,
    marginTop: THEME.spacing.md,
  },
  emptyText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.lg,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.borderRadius.lg,
    marginTop: THEME.spacing.lg,
    gap: THEME.spacing.sm,
  },
  scanButtonText: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textWhite,
  },
});
