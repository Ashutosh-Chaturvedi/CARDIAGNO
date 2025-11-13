import { COLORS } from '../constants/colors';

// Heart rate calculations
export const calculateHeartRateZone = (heartRate, age) => {
  const maxHeartRate = 220 - age;
  const percentage = (heartRate / maxHeartRate) * 100;

  if (percentage < 50) return { zone: 'Resting', color: COLORS.RESTING };
  if (percentage < 60) return { zone: 'Light', color: COLORS.LIGHT };
  if (percentage < 70) return { zone: 'Moderate', color: COLORS.MODERATE };
  if (percentage < 85) return { zone: 'Vigorous', color: COLORS.VIGOROUS };
  return { zone: 'Maximum', color: COLORS.MAXIMUM };
};

export const getHeartRateStatus = (heartRate) => {
  if (heartRate < 60) return { status: 'Low', color: COLORS.LOW_RISK, icon: 'arrow-down-circle' };
  if (heartRate <= 100) return { status: 'Normal', color: COLORS.LOW_RISK, icon: 'checkmark-circle' };
  if (heartRate <= 120) return { status: 'Elevated', color: COLORS.MEDIUM_RISK, icon: 'alert-circle' };
  return { status: 'High', color: COLORS.HIGH_RISK, icon: 'warning' };
};

// Blood pressure calculations
export const getBloodPressureStatus = (systolic, diastolic) => {
  if (systolic < 90 || diastolic < 60) {
    return { status: 'Low', color: COLORS.MEDIUM_RISK, message: 'Hypotension' };
  }
  if (systolic < 120 && diastolic < 80) {
    return { status: 'Normal', color: COLORS.LOW_RISK, message: 'Optimal' };
  }
  if (systolic < 130 && diastolic < 80) {
    return { status: 'Elevated', color: COLORS.MEDIUM_RISK, message: 'Prehypertension' };
  }
  if (systolic < 140 || diastolic < 90) {
    return { status: 'High', color: COLORS.HIGH_RISK, message: 'Stage 1 Hypertension' };
  }
  return { status: 'Very High', color: COLORS.CRITICAL_RISK, message: 'Stage 2 Hypertension' };
};

// Cholesterol calculations
export const getCholesterolStatus = (total, hdl, ldl) => {
  const risks = [];
  
  if (total > 240) risks.push('High total cholesterol');
  if (hdl < 40) risks.push('Low HDL (good cholesterol)');
  if (ldl > 160) risks.push('High LDL (bad cholesterol)');
  
  if (risks.length === 0) {
    return { status: 'Optimal', color: COLORS.LOW_RISK, risks: [] };
  }
  if (risks.length === 1) {
    return { status: 'Borderline', color: COLORS.MEDIUM_RISK, risks };
  }
  return { status: 'High Risk', color: COLORS.HIGH_RISK, risks };
};

// BMI calculations
export const calculateBMI = (weight, height) => {
  // weight in kg, height in cm
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10;
};

export const getBMIStatus = (bmi) => {
  if (bmi < 18.5) return { status: 'Underweight', color: COLORS.MEDIUM_RISK };
  if (bmi < 25) return { status: 'Normal', color: COLORS.LOW_RISK };
  if (bmi < 30) return { status: 'Overweight', color: COLORS.MEDIUM_RISK };
  return { status: 'Obese', color: COLORS.HIGH_RISK };
};

// Risk assessment
export const assessCardiovascularRisk = (metrics) => {
  const riskFactors = [];
  let riskScore = 0;

  // Age
  if (metrics.age > 65) {
    riskFactors.push('Age over 65');
    riskScore += 2;
  } else if (metrics.age > 45) {
    riskFactors.push('Age over 45');
    riskScore += 1;
  }

  // Blood pressure
  if (metrics.systolic > 140 || metrics.diastolic > 90) {
    riskFactors.push('High blood pressure');
    riskScore += 2;
  }

  // Cholesterol
  if (metrics.totalCholesterol > 240) {
    riskFactors.push('High cholesterol');
    riskScore += 2;
  }

  // Smoking
  if (metrics.smoker) {
    riskFactors.push('Smoking');
    riskScore += 3;
  }

  // Diabetes
  if (metrics.diabetic) {
    riskFactors.push('Diabetes');
    riskScore += 2;
  }

  // BMI
  const bmi = calculateBMI(metrics.weight, metrics.height);
  if (bmi >= 30) {
    riskFactors.push('Obesity');
    riskScore += 2;
  }

  // Family history
  if (metrics.familyHistory) {
    riskFactors.push('Family history of heart disease');
    riskScore += 1;
  }

  let riskLevel, color;
  if (riskScore <= 2) {
    riskLevel = 'Low';
    color = COLORS.LOW_RISK;
  } else if (riskScore <= 5) {
    riskLevel = 'Moderate';
    color = COLORS.MEDIUM_RISK;
  } else if (riskScore <= 8) {
    riskLevel = 'High';
    color = COLORS.HIGH_RISK;
  } else {
    riskLevel = 'Critical';
    color = COLORS.CRITICAL_RISK;
  }

  return {
    riskLevel,
    riskScore,
    riskFactors,
    color,
  };
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
