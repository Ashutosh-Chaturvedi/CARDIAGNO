import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Card, Button } from '../components';
import { THEME } from '../constants/theme';
import { analyzeMedicalReport, getUrgencyColor, getUrgencyIcon } from '../services/visionService';
import { saveScanResult } from '../utils/storage';

export const ScanScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant photo library permissions to upload medical reports.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
        base64: false,
      });

      if (!result.canceled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedImage(result.assets[0].uri);
        setAnalysis(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant camera permissions to take photos of medical reports.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setSelectedImage(result.assets[0].uri);
        setAnalysis(null);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const analyzeReport = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or take a photo of your medical report first.');
      return;
    }

    // Check network connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Using offline mode with demo data. For full analysis, please connect to the internet.',
        [{ text: 'Continue', onPress: () => proceedWithAnalysis() }]
      );
      return;
    }

    proceedWithAnalysis();
  };

  const proceedWithAnalysis = async () => {
    setAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const result = await analyzeMedicalReport(selectedImage);
      setAnalysis(result);
      
      // Save to history
      await saveScanResult({
        imageUri: selectedImage,
        ...result,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Analysis error:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Analysis Failed', error.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetScan = () => {
    setSelectedImage(null);
    setAnalysis(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="scan-circle" size={48} color={THEME.colors.primary} />
        <Text style={styles.title}>Medical Report Scanner</Text>
        <Text style={styles.subtitle}>
          Upload or photograph your medical reports for AI-powered OCR and analysis
        </Text>
      </View>

      {/* Image Selection */}
      {!selectedImage ? (
        <View style={styles.uploadSection}>
          <Card style={styles.uploadCard}>
            <Ionicons name="cloud-upload-outline" size={80} color={THEME.colors.textSecondary} />
            <Text style={styles.uploadText}>No report selected</Text>
            <Text style={styles.uploadHint}>
              Upload lab results, ECG reports, prescriptions, or other medical documents
            </Text>
          </Card>

          <View style={styles.buttonGroup}>
            <Button
              title="Take Photo"
              onPress={takePhoto}
              variant="primary"
              size="large"
              icon="camera"
              fullWidth
              style={styles.actionButton}
            />
            <Button
              title="Choose from Gallery"
              onPress={pickImage}
              variant="secondary"
              size="large"
              icon="images"
              fullWidth
              style={styles.actionButton}
            />
          </View>
        </View>
      ) : (
        <View style={styles.imageSection}>
          <Card style={styles.imageCard}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            <TouchableOpacity style={styles.removeButton} onPress={resetScan}>
              <Ionicons name="close-circle" size={36} color={THEME.colors.error} />
            </TouchableOpacity>
          </Card>

          {!analysis && (
            <Button
              title={analyzing ? 'Analyzing Report...' : 'Analyze Report'}
              onPress={analyzeReport}
              variant="primary"
              size="large"
              icon="scan"
              disabled={analyzing}
              loading={analyzing}
              fullWidth
              style={styles.analyzeButton}
            />
          )}
        </View>
      )}

      {/* Loading State */}
      {analyzing && (
        <Card style={styles.loadingCard}>
          <ActivityIndicator size="large" color={THEME.colors.primary} />
          <Text style={styles.loadingText}>Analyzing your medical report...</Text>
          <Text style={styles.loadingHint}>Extracting text and identifying health metrics</Text>
        </Card>
      )}

      {/* Analysis Results */}
      {analysis && !analyzing && (
        <View style={styles.resultsSection}>
          {/* Urgency Badge */}
          <Card style={[styles.urgencyCard, { borderLeftColor: getUrgencyColor(analysis.urgency) }]}>
            <View style={styles.urgencyHeader}>
              <Ionicons
                name={getUrgencyIcon(analysis.urgency)}
                size={32}
                color={getUrgencyColor(analysis.urgency)}
              />
              <View style={styles.urgencyTextContainer}>
                <Text style={styles.urgencyLabel}>Urgency Level</Text>
                <Text style={[styles.urgencyValue, { color: getUrgencyColor(analysis.urgency) }]}>
                  {analysis.urgency}
                </Text>
              </View>
            </View>
          </Card>

          {/* OCR Text */}
          {analysis.ocrText && (
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="text-outline" size={24} color={THEME.colors.info} />
                <Text style={styles.resultTitle}>Extracted Text (OCR)</Text>
              </View>
              <ScrollView style={styles.ocrScrollView} nestedScrollEnabled>
                <Text style={styles.ocrText}>{analysis.ocrText}</Text>
              </ScrollView>
            </Card>
          )}

          {/* Key Metrics */}
          {analysis.keyMetrics && analysis.keyMetrics.length > 0 && (
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="analytics-outline" size={24} color={THEME.colors.secondary} />
                <Text style={styles.resultTitle}>Key Metrics</Text>
              </View>
              {analysis.keyMetrics.map((metric, index) => (
                <View key={index} style={styles.metricRow}>
                  <Text style={styles.metricName}>{metric.name}</Text>
                  <View style={styles.metricRight}>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={[styles.metricStatus, { 
                      color: metric.status === 'Normal' || metric.status === 'Good' || metric.status === 'Optimal' 
                        ? THEME.colors.success 
                        : THEME.colors.warning 
                    }]}>
                      {metric.status}
                    </Text>
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Summary */}
          <Card style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="document-text-outline" size={24} color={THEME.colors.primary} />
              <Text style={styles.resultTitle}>Summary</Text>
            </View>
            <Text style={styles.resultText}>{analysis.summary}</Text>
          </Card>

          {/* Risk Factors */}
          {analysis.riskFactors && analysis.riskFactors.length > 0 && (
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="warning-outline" size={24} color={THEME.colors.warning} />
                <Text style={styles.resultTitle}>Risk Factors</Text>
              </View>
              {analysis.riskFactors.map((risk, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={styles.bullet} />
                  <Text style={styles.listText}>{risk}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Recommendations */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <Card style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Ionicons name="checkmark-circle-outline" size={24} color={THEME.colors.success} />
                <Text style={styles.resultTitle}>Recommendations</Text>
              </View>
              {analysis.recommendations.map((rec, index) => (
                <View key={index} style={styles.listItem}>
                  <View style={[styles.bullet, { backgroundColor: THEME.colors.success }]} />
                  <Text style={styles.listText}>{rec}</Text>
                </View>
              ))}
            </Card>
          )}

          {/* Disclaimer */}
          <Card style={styles.disclaimerCard}>
            <Ionicons name="information-circle" size={20} color={THEME.colors.info} />
            <Text style={styles.disclaimerText}>
              This analysis is for informational purposes only and should not replace professional
              medical advice. Please consult with your healthcare provider for proper diagnosis and
              treatment.
            </Text>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="Scan Another Report"
              onPress={resetScan}
              variant="secondary"
              size="medium"
              icon="add-circle"
              fullWidth
              style={styles.bottomButton}
            />
            <Button
              title="Ask AI Assistant"
              onPress={() => navigation.navigate('Chat')}
              variant="primary"
              size="medium"
              icon="chatbubbles"
              fullWidth
              style={styles.bottomButton}
            />
          </View>
        </View>
      )}

      {/* Info Section */}
      {!selectedImage && !analysis && (
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>How it works:</Text>
          <View style={styles.infoItem}>
            <Ionicons name="camera" size={24} color={THEME.colors.primary} />
            <Text style={styles.infoText}>Take a clear photo or upload your medical report</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="scan" size={24} color={THEME.colors.primary} />
            <Text style={styles.infoText}>AI extracts text using OCR technology</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="analytics" size={24} color={THEME.colors.primary} />
            <Text style={styles.infoText}>Analyzes health metrics and identifies risks</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="heart" size={24} color={THEME.colors.primary} />
            <Text style={styles.infoText}>Get personalized recommendations</Text>
          </View>
        </Card>
      )}
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
    paddingBottom: THEME.spacing.xxl,
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textPrimary,
    marginTop: THEME.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  
  // Upload Section
  uploadSection: {
    marginBottom: THEME.spacing.lg,
  },
  uploadCard: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xxl,
    marginBottom: THEME.spacing.md,
  },
  uploadText: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginTop: THEME.spacing.md,
  },
  uploadHint: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.lg,
  },
  buttonGroup: {
    gap: THEME.spacing.sm,
  },
  actionButton: {
    marginBottom: THEME.spacing.sm,
  },
  
  // Image Section
  imageSection: {
    marginBottom: THEME.spacing.lg,
  },
  imageCard: {
    padding: 0,
    overflow: 'hidden',
    marginBottom: THEME.spacing.md,
  },
  previewImage: {
    width: '100%',
    height: 400,
    resizeMode: 'contain',
    backgroundColor: THEME.colors.border,
  },
  removeButton: {
    position: 'absolute',
    top: THEME.spacing.sm,
    right: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderRadius: 18,
  },
  analyzeButton: {
    marginBottom: THEME.spacing.md,
  },
  
  // Loading
  loadingCard: {
    alignItems: 'center',
    paddingVertical: THEME.spacing.xl,
    marginBottom: THEME.spacing.lg,
  },
  loadingText: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginTop: THEME.spacing.md,
  },
  loadingHint: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
  },
  
  // Results
  resultsSection: {
    marginBottom: THEME.spacing.lg,
  },
  urgencyCard: {
    borderLeftWidth: 4,
    marginBottom: THEME.spacing.md,
  },
  urgencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgencyTextContainer: {
    marginLeft: THEME.spacing.md,
  },
  urgencyLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  urgencyValue: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    marginTop: THEME.spacing.xs,
  },
  resultCard: {
    marginBottom: THEME.spacing.md,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  resultTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginLeft: THEME.spacing.sm,
  },
  resultText: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
    lineHeight: 22,
  },
  
  // OCR Text
  ocrScrollView: {
    maxHeight: 200,
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
  },
  ocrText: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textPrimary,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  
  // Metrics
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.borderLight,
  },
  metricName: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
    flex: 1,
  },
  metricRight: {
    alignItems: 'flex-end',
  },
  metricValue: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  metricStatus: {
    fontSize: THEME.fonts.sizes.xs,
    fontWeight: THEME.fonts.weights.medium,
    marginTop: THEME.spacing.xs,
  },
  
  // Lists
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: THEME.spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.warning,
    marginTop: 8,
    marginRight: THEME.spacing.sm,
  },
  listText: {
    flex: 1,
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
    lineHeight: 22,
  },
  
  // Disclaimer
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: THEME.colors.info + '10',
    marginBottom: THEME.spacing.md,
  },
  disclaimerText: {
    flex: 1,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
    marginLeft: THEME.spacing.sm,
    lineHeight: 20,
  },
  
  // Action Buttons
  actionButtons: {
    gap: THEME.spacing.sm,
  },
  bottomButton: {
    marginBottom: THEME.spacing.sm,
  },
  
  // Info
  infoCard: {
    marginTop: THEME.spacing.md,
  },
  infoTitle: {
    fontSize: THEME.fonts.sizes.lg,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  infoText: {
    flex: 1,
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
    marginLeft: THEME.spacing.md,
  },
});
