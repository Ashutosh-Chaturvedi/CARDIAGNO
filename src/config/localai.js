// AI API Configuration
// Using Groq - Free, fast AI API (no credit card required)
// Get your free API key at: https://console.groq.com

// OPTION 1: Add your API key directly here (quick setup)
// PASTE YOUR ACTUAL GROQ API KEY HERE (starts with gsk_)
const GROQ_API_KEY = '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';

// OPTION 2: Use environment variables (recommended for production)
const ENV_GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;

export const AI_CONFIG = {
  // API Provider: 'groq' or 'openai'
  provider: 'groq',
  
  // Groq Configuration (FREE)
  groq: {
    baseURL: 'https://api.groq.com',
    apiKey: ENV_GROQ_KEY || GROQ_API_KEY, // Use env variable first, fallback to hardcoded
    models: {
      chat: 'llama-3.1-8b-instant', // Current recommended Groq model
      vision: 'llama-3.1-8b-instant', // Use text model as fallback for vision
    },
    timeout: 30000,
  },
  
  // OpenAI Configuration (Paid, backup option)
  openai: {
    baseURL: 'https://api.openai.com',
    apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || 'sk_', // Set in .env file
    models: {
      chat: 'gpt-3.5-turbo',
      vision: 'gpt-4-vision-preview',
    },
    timeout: 30000,
  },
};

// Get current provider config
export const getProviderConfig = () => {
  return AI_CONFIG[AI_CONFIG.provider];
};

// Get API base URL
export const getAPIBaseURL = () => {
  return getProviderConfig().baseURL;
};

// Get API key
export const getAPIKey = () => {
  return getProviderConfig().apiKey;
};

// Get model for specific task
export const getModel = (task = 'chat') => {
  return getProviderConfig().models[task];
};

// Check if API is configured
export const isAPIConfigured = () => {
  const config = getProviderConfig();
  return config.apiKey && 
         config.apiKey !== 'gsk_paste_your_actual_api_key_here' && 
         config.apiKey !== 'YOUR_OPENAI_API_KEY_HERE' &&
         config.apiKey.length > 20; // Ensure it's a real API key
};
