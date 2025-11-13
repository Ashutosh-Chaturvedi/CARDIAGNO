import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, Button } from '../components';
import { THEME } from '../constants/theme';
import { getUserProfile, saveUserProfile } from '../utils/storage';
import { calculateBMI, getBMIStatus, assessCardiovascularRisk } from '../utils/healthMetrics';

export const ProfileScreen = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: 'male',
    height: '',
    weight: '',
    systolic: '',
    diastolic: '',
    totalCholesterol: '',
    smoker: false,
    diabetic: false,
    familyHistory: false,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const savedProfile = await getUserProfile();
    if (savedProfile) {
      setProfile(savedProfile);
    }
  };

  const handleSave = async () => {
    try {
      await saveUserProfile(profile);
      setEditing(false);
      Alert.alert('Success', 'Profile saved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    loadProfile();
  };

  const getRiskAssessment = () => {
    if (!profile.age || !profile.height || !profile.weight) {
      return null;
    }

    const metrics = {
      age: parseInt(profile.age),
      height: parseFloat(profile.height),
      weight: parseFloat(profile.weight),
      systolic: parseFloat(profile.systolic) || 120,
      diastolic: parseFloat(profile.diastolic) || 80,
      totalCholesterol: parseFloat(profile.totalCholesterol) || 200,
      smoker: profile.smoker,
      diabetic: profile.diabetic,
      familyHistory: profile.familyHistory,
    };

    return assessCardiovascularRisk(metrics);
  };

  const getBMI = () => {
    if (!profile.height || !profile.weight) return null;
    return calculateBMI(parseFloat(profile.weight), parseFloat(profile.height));
  };

  const bmi = getBMI();
  const bmiStatus = bmi ? getBMIStatus(bmi) : null;
  const riskAssessment = getRiskAssessment();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <Card style={styles.headerCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={THEME.colors.primary} />
        </View>
        <Text style={styles.name}>{profile.name || 'Your Name'}</Text>
        <Text style={styles.subtitle}>
          {profile.age ? `${profile.age} years old` : 'Age not set'}
        </Text>
        
        {!editing && (
          <Button
            title="Edit Profile"
            onPress={() => setEditing(true)}
            variant="secondary"
            size="small"
            icon="create-outline"
            style={styles.editButton}
          />
        )}
      </Card>

      {/* Health Metrics Summary */}
      {!editing && bmi && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Metrics</Text>
          
          <Card style={styles.metricCard}>
            <View style={styles.metricRow}>
              <View style={styles.metricInfo}>
                <Text style={styles.metricLabel}>BMI</Text>
                <Text style={styles.metricValue}>{bmi}</Text>
                <Text style={[styles.metricStatus, { color: bmiStatus.color }]}>
                  {bmiStatus.status}
                </Text>
              </View>
              <Ionicons name="fitness" size={40} color={bmiStatus.color} />
            </View>
          </Card>

          {riskAssessment && (
            <Card style={[styles.riskCard, { borderLeftColor: riskAssessment.color }]}>
              <View style={styles.riskHeader}>
                <Ionicons name="heart" size={28} color={riskAssessment.color} />
                <View style={styles.riskInfo}>
                  <Text style={styles.riskLabel}>Cardiovascular Risk</Text>
                  <Text style={[styles.riskLevel, { color: riskAssessment.color }]}>
                    {riskAssessment.riskLevel}
                  </Text>
                </View>
              </View>
              
              {riskAssessment.riskFactors.length > 0 && (
                <View style={styles.riskFactorsContainer}>
                  <Text style={styles.riskFactorsTitle}>Risk Factors:</Text>
                  {riskAssessment.riskFactors.map((factor, index) => (
                    <View key={index} style={styles.riskFactorItem}>
                      <View style={styles.bullet} />
                      <Text style={styles.riskFactorText}>{factor}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          )}
        </View>
      )}

      {/* Profile Form */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {editing ? 'Edit Information' : 'Personal Information'}
        </Text>

        <Card style={styles.formCard}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={profile.name}
              onChangeText={(text) => setProfile({ ...profile, name: text })}
              placeholder="Enter your name"
              editable={editing}
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Age</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={profile.age}
                onChangeText={(text) => setProfile({ ...profile, age: text })}
                placeholder="Age"
                keyboardType="numeric"
                editable={editing}
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    profile.gender === 'male' && styles.genderButtonActive,
                    !editing && styles.genderButtonDisabled,
                  ]}
                  onPress={() => editing && setProfile({ ...profile, gender: 'male' })}
                  disabled={!editing}
                >
                  <Ionicons
                    name="male"
                    size={20}
                    color={profile.gender === 'male' ? THEME.colors.textWhite : THEME.colors.textSecondary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    profile.gender === 'female' && styles.genderButtonActive,
                    !editing && styles.genderButtonDisabled,
                  ]}
                  onPress={() => editing && setProfile({ ...profile, gender: 'female' })}
                  disabled={!editing}
                >
                  <Ionicons
                    name="female"
                    size={20}
                    color={profile.gender === 'female' ? THEME.colors.textWhite : THEME.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={profile.height}
                onChangeText={(text) => setProfile({ ...profile, height: text })}
                placeholder="170"
                keyboardType="numeric"
                editable={editing}
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={profile.weight}
                onChangeText={(text) => setProfile({ ...profile, weight: text })}
                placeholder="70"
                keyboardType="numeric"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Systolic BP</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={profile.systolic}
                onChangeText={(text) => setProfile({ ...profile, systolic: text })}
                placeholder="120"
                keyboardType="numeric"
                editable={editing}
              />
            </View>

            <View style={[styles.formGroup, styles.formGroupHalf]}>
              <Text style={styles.label}>Diastolic BP</Text>
              <TextInput
                style={[styles.input, !editing && styles.inputDisabled]}
                value={profile.diastolic}
                onChangeText={(text) => setProfile({ ...profile, diastolic: text })}
                placeholder="80"
                keyboardType="numeric"
                editable={editing}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Total Cholesterol (mg/dL)</Text>
            <TextInput
              style={[styles.input, !editing && styles.inputDisabled]}
              value={profile.totalCholesterol}
              onChangeText={(text) => setProfile({ ...profile, totalCholesterol: text })}
              placeholder="200"
              keyboardType="numeric"
              editable={editing}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Smoker</Text>
            <Switch
              value={profile.smoker}
              onValueChange={(value) => editing && setProfile({ ...profile, smoker: value })}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              disabled={!editing}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Diabetic</Text>
            <Switch
              value={profile.diabetic}
              onValueChange={(value) => editing && setProfile({ ...profile, diabetic: value })}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              disabled={!editing}
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.label}>Family History of Heart Disease</Text>
            <Switch
              value={profile.familyHistory}
              onValueChange={(value) => editing && setProfile({ ...profile, familyHistory: value })}
              trackColor={{ false: THEME.colors.border, true: THEME.colors.primary }}
              disabled={!editing}
            />
          </View>
        </Card>

        {editing && (
          <View style={styles.buttonGroup}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              size="medium"
              style={styles.button}
            />
            <Button
              title="Save Profile"
              onPress={handleSave}
              variant="primary"
              size="medium"
              icon="checkmark"
              style={styles.button}
            />
          </View>
        )}
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={THEME.colors.textSecondary} />
            <Text style={styles.infoText}>CardiagnoAI v1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={THEME.colors.textSecondary} />
            <Text style={styles.infoText}>Your data is stored locally and securely</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="heart-outline" size={20} color={THEME.colors.textSecondary} />
            <Text style={styles.infoText}>Made with care for your heart health</Text>
          </View>
        </Card>
      </View>
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
  headerCard: {
    alignItems: 'center',
    marginBottom: THEME.spacing.lg,
  },
  avatarContainer: {
    marginBottom: THEME.spacing.sm,
  },
  name: {
    fontSize: THEME.fonts.sizes.xxl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
  },
  editButton: {
    marginTop: THEME.spacing.sm,
  },
  section: {
    marginBottom: THEME.spacing.lg,
  },
  sectionTitle: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.md,
  },
  metricCard: {
    marginBottom: THEME.spacing.sm,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricInfo: {
    flex: 1,
  },
  metricLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  metricValue: {
    fontSize: THEME.fonts.sizes.xxxl,
    fontWeight: THEME.fonts.weights.bold,
    color: THEME.colors.textPrimary,
    marginVertical: THEME.spacing.xs,
  },
  metricStatus: {
    fontSize: THEME.fonts.sizes.md,
    fontWeight: THEME.fonts.weights.semibold,
  },
  riskCard: {
    borderLeftWidth: 4,
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  riskInfo: {
    marginLeft: THEME.spacing.md,
  },
  riskLabel: {
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  riskLevel: {
    fontSize: THEME.fonts.sizes.xl,
    fontWeight: THEME.fonts.weights.bold,
    marginTop: THEME.spacing.xs,
  },
  riskFactorsContainer: {
    marginTop: THEME.spacing.sm,
  },
  riskFactorsTitle: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.xs,
  },
  riskFactorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.xs,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: THEME.colors.warning,
    marginRight: THEME.spacing.sm,
  },
  riskFactorText: {
    flex: 1,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  formCard: {
    marginBottom: THEME.spacing.md,
  },
  formGroup: {
    marginBottom: THEME.spacing.md,
  },
  formGroupHalf: {
    flex: 1,
  },
  formRow: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  label: {
    fontSize: THEME.fonts.sizes.sm,
    fontWeight: THEME.fonts.weights.semibold,
    color: THEME.colors.textPrimary,
    marginBottom: THEME.spacing.xs,
  },
  input: {
    backgroundColor: THEME.colors.background,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
    fontSize: THEME.fonts.sizes.md,
    color: THEME.colors.textPrimary,
  },
  inputDisabled: {
    backgroundColor: THEME.colors.borderLight,
    color: THEME.colors.textSecondary,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  genderButton: {
    flex: 1,
    padding: THEME.spacing.md,
    borderRadius: THEME.borderRadius.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonActive: {
    backgroundColor: THEME.colors.primary,
    borderColor: THEME.colors.primary,
  },
  genderButtonDisabled: {
    opacity: 0.6,
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  button: {
    flex: 1,
  },
  infoCard: {
    gap: THEME.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
});
