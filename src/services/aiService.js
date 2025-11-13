import axios from 'axios';
import { getAPIBaseURL, getAPIKey, getModel, isAPIConfigured } from '../config/localai';

// API Configuration
const API_BASE_URL = getAPIBaseURL();
const API_URL = `${API_BASE_URL}/openai/v1/chat/completions`;
const API_KEY = getAPIKey();
const CHAT_MODEL = getModel('chat');

/**
 * Send a message to the AI assistant
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context
 * @returns {Promise<string>} - The AI's response
 */
export const sendMessageToAI = async (userMessage, conversationHistory = []) => {
  try {
    console.log('=== AI SERVICE DEBUG ===');
    console.log('API Base URL:', API_URL);
    console.log('Model:', CHAT_MODEL);
    console.log('API Key:', API_KEY);
    console.log('API Key type:', typeof API_KEY);
    console.log('API Key length:', API_KEY ? API_KEY.length : 'undefined');
    console.log('API Key starts with:', API_KEY ? API_KEY.substring(0, 15) + '...' : 'none');
    console.log('API Key ends with:', API_KEY ? '...' + API_KEY.substring(API_KEY.length - 10) : 'none');
    
    // Check if API key is configured
    if (!isAPIConfigured()) {
      console.log('No API key configured, using mock responses');
      return generateMockResponse(userMessage);
    }

    console.log('API key configured, making API call...');

    const messages = [
      {
        role: 'system',
        content: `You are CardiagnoAI, a helpful and empathetic cardiovascular health assistant.

Your role:
- Provide accurate, evidence-based information about heart health
- Help users understand their medical reports and health metrics
- Offer lifestyle and wellness advice for cardiovascular health
- Suggest when to seek professional medical attention
- Be supportive, encouraging, and easy to understand

Guidelines:
- Always emphasize you're not a replacement for professional medical advice
- For serious symptoms (chest pain, severe shortness of breath), urgently recommend calling emergency services
- Use simple, clear language
- Be concise but thorough
- Show empathy and understanding

Do NOT:
- Diagnose medical conditions
- Prescribe medications
- Give advice that contradicts medical professionals
- Make definitive medical claims`
      },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await axios.post(
      API_URL,
      {
        model: CHAT_MODEL,
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content.trim();
    } else {
      throw new Error('No response from AI');
    }
  } catch (error) {
    console.error('AI Service Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    }
    
    // Fallback to mock response
    return generateMockResponse(userMessage);
  }
};

/**
 * Generate mock responses for demonstration
 */
const generateMockResponse = (userInput) => {
  const input = userInput.toLowerCase();
  
  if (input.includes('heart rate') || input.includes('bpm') || input.includes('pulse')) {
    return "A normal resting heart rate for adults ranges from 60 to 100 beats per minute. Athletes may have lower rates (40-60 bpm) due to better cardiovascular fitness. Factors like stress, medications, caffeine, and physical activity can affect your heart rate. If you're concerned about irregular readings, please consult with a healthcare professional.";
  }
  
  if (input.includes('blood pressure') || input.includes('bp') || input.includes('hypertension')) {
    return "Normal blood pressure is typically below 120/80 mmHg. Readings between 120-129/<80 are considered elevated, while 130-139/80-89 indicates Stage 1 hypertension. Regular monitoring, reducing sodium intake, maintaining healthy weight, and regular exercise can help manage blood pressure. Always consult your doctor for personalized advice.";
  }
  
  if (input.includes('cholesterol') || input.includes('ldl') || input.includes('hdl')) {
    return "Cholesterol management is crucial for heart health:\n\n• Total cholesterol: <200 mg/dL is desirable\n• LDL (bad): <100 mg/dL is optimal\n• HDL (good): >60 mg/dL is protective\n• Triglycerides: <150 mg/dL is normal\n\nA heart-healthy diet, regular exercise, and maintaining healthy weight can improve cholesterol levels.";
  }
  
  if (input.includes('exercise') || input.includes('workout') || input.includes('physical activity')) {
    return "Regular exercise is excellent for heart health! Aim for:\n\n• 150 minutes of moderate aerobic activity per week\n• Or 75 minutes of vigorous activity\n• Include strength training 2+ days/week\n\nDuring exercise, your heart rate naturally increases. Start slowly if you're new to exercise, and always warm up and cool down. Consult your doctor before starting a new exercise program.";
  }
  
  if (input.includes('chest pain') || input.includes('pain in chest') || input.includes('heart attack')) {
    return "⚠️ IMPORTANT: If you're experiencing chest pain, pressure, shortness of breath, or other concerning symptoms, please seek immediate medical attention by calling emergency services (101 for ambulance).\n\nChest pain can be a sign of serious conditions requiring urgent care. Don't wait - get help immediately.";
  }
  
  if (input.includes('diet') || input.includes('food') || input.includes('nutrition')) {
    return "A heart-healthy diet includes:\n\n✓ Fruits and vegetables (5+ servings daily)\n✓ Whole grains (oats, brown rice, quinoa)\n✓ Lean proteins (fish, poultry, legumes)\n✓ Healthy fats (olive oil, nuts, avocado)\n✓ Fatty fish rich in omega-3 (salmon, mackerel)\n\n✗ Limit: sodium, saturated fats, trans fats, added sugars\n\nStay hydrated and practice portion control for optimal heart health.";
  }
  
  if (input.includes('stress') || input.includes('anxiety') || input.includes('mental health')) {
    return "Stress management is vital for heart health. Try these techniques:\n\n• Deep breathing exercises (4-7-8 technique)\n• Regular physical activity\n• Adequate sleep (7-9 hours nightly)\n• Meditation or mindfulness\n• Social connections and support\n• Time management and relaxation\n\nChronic stress can affect cardiovascular health. If stress feels overwhelming, consider talking to a mental health professional.";
  }
  
  if (input.includes('medication') || input.includes('medicine') || input.includes('pills')) {
    return "Important medication reminders:\n\n• Take medications exactly as prescribed\n• Never stop or change doses without consulting your doctor\n• Set reminders to maintain consistency\n• Keep a list of all medications\n• Report side effects to your healthcare provider\n• Don't skip doses\n\nWould you like help setting up medication reminders in the app?";
  }
  
  if (input.includes('report') || input.includes('scan') || input.includes('analyze')) {
    return "I can help you understand your medical reports! Use the Scan feature to:\n\n1. Take a photo or upload your medical report\n2. Get AI-powered analysis of key metrics\n3. Understand risk factors\n4. Receive personalized recommendations\n\nTap the Scan tab to get started. Remember, this is for informational purposes - always discuss results with your healthcare provider.";
  }
  
  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    return "Hello! I'm CardiagnoAI, your heart health assistant. I can help you with:\n\n• Understanding heart health metrics\n• Analyzing medical reports\n• Lifestyle and diet advice\n• Exercise recommendations\n• Stress management\n• General cardiovascular health questions\n\nWhat would you like to know about your heart health today?";
  }
  
  // Default response
  return "I'm here to help with heart health questions! You can ask me about:\n\n• Heart rate and blood pressure\n• Cholesterol and lipid panels\n• Exercise and fitness\n• Diet and nutrition\n• Stress management\n• Understanding medical reports\n• Medication reminders\n\nWhat specific aspect of heart health would you like to discuss?";
};

/**
 * Check if API key is configured
 */
export const isAPIKeyConfigured = isAPIConfigured;
