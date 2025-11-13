import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const KEYS = {
  SCAN_HISTORY: '@cardiagno_scan_history',
  CHAT_HISTORY: '@cardiagno_chat_history',
  HEALTH_METRICS: '@cardiagno_health_metrics',
  USER_PROFILE: '@cardiagno_user_profile',
};

// Scan History
export const getScanHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SCAN_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting scan history:', error);
    return [];
  }
};

export const saveScanResult = async (scanData) => {
  try {
    const history = await getScanHistory();
    const newScan = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...scanData,
    };
    const updatedHistory = [newScan, ...history];
    await AsyncStorage.setItem(KEYS.SCAN_HISTORY, JSON.stringify(updatedHistory));
    return newScan;
  } catch (error) {
    console.error('Error saving scan result:', error);
    throw error;
  }
};

export const deleteScanResult = async (id) => {
  try {
    const history = await getScanHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    await AsyncStorage.setItem(KEYS.SCAN_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error deleting scan result:', error);
    throw error;
  }
};

export const clearScanHistory = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.SCAN_HISTORY);
  } catch (error) {
    console.error('Error clearing scan history:', error);
    throw error;
  }
};

// Chat History
export const getChatHistory = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting chat history:', error);
    return [];
  }
};

export const saveChatMessage = async (message) => {
  try {
    const history = await getChatHistory();
    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...message,
    };
    const updatedHistory = [...history, newMessage];
    await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(updatedHistory));
    return newMessage;
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const clearChatHistory = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.CHAT_HISTORY);
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
};

// Health Metrics
export const getHealthMetrics = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.HEALTH_METRICS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting health metrics:', error);
    return [];
  }
};

export const saveHealthMetric = async (metric) => {
  try {
    const metrics = await getHealthMetrics();
    const newMetric = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...metric,
    };
    const updatedMetrics = [newMetric, ...metrics];
    await AsyncStorage.setItem(KEYS.HEALTH_METRICS, JSON.stringify(updatedMetrics));
    return newMetric;
  } catch (error) {
    console.error('Error saving health metric:', error);
    throw error;
  }
};

// User Profile
export const getUserProfile = async () => {
  try {
    const data = await AsyncStorage.getItem(KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const saveUserProfile = async (profile) => {
  try {
    await AsyncStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};
