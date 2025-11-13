export const THEME = {
  colors: {
    // Primary palette - Heart health themed
    primary: '#FF6B6B',
    primaryLight: '#FF8E8E',
    primaryDark: '#E85555',
    
    // Secondary colors
    secondary: '#4ECDC4',
    secondaryLight: '#7EDDD6',
    secondaryDark: '#3DBDB5',
    
    // Status colors
    success: '#51CF66',
    warning: '#FFB84D',
    error: '#FF6B6B',
    info: '#4DABF7',
    
    // Neutral colors
    background: '#F8F9FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text colors
    textPrimary: '#212529',
    textSecondary: '#6C757D',
    textLight: '#ADB5BD',
    textWhite: '#FFFFFF',
    
    // Border colors
    border: '#DEE2E6',
    borderLight: '#E9ECEF',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',
    
    // Gradients
    gradientStart: '#FF6B6B',
    gradientEnd: '#FF8E8E',
  },
  
  fonts: {
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },
};
