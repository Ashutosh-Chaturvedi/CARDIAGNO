import axios from 'axios';
import { File } from 'expo-file-system';
import { createWorker } from 'tesseract.js';
import { getAPIBaseURL, getAPIKey, getModel, isAPIConfigured } from '../config/localai';

// API Configuration
const API_BASE_URL = getAPIBaseURL();
const API_URL = `${API_BASE_URL}/openai/v1/chat/completions`;
const API_KEY = getAPIKey();
const VISION_MODEL = getModel('vision');

// OCR Space API Configuration
const OCR_SPACE_API_KEY = 'K85716597088957';
const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

/**
 * Analyzes a medical report image using OpenAI Vision API
 * @param {string} imageUri - Local URI of the image
 * @returns {Promise<Object>} Analysis results with OCR text and medical insights
 */
export const analyzeMedicalReport = async (imageUri) => {
  try {
    console.log('=== Starting Medical Report Analysis ===');
    console.log('Image URI:', imageUri);
    console.log('API Configured:', isAPIConfigured());
    console.log('Groq API Key exists:', !!getAPIKey());
    
    // Check if API key is configured
    if (!isAPIConfigured()) {
      console.log('No API key configured, using Tesseract fallback');
      return await tryTesseractOCR(imageUri);
    }

    // Try OCR Space API first, but fallback to Tesseract if it fails
    console.log('Trying OCR Space API for image OCR analysis...');
    console.log('OCR Space API Key:', OCR_SPACE_API_KEY ? 'Present' : 'Missing');
    
    try {
      return await tryOCRSpaceAPI(imageUri);
    } catch (ocrError) {
      console.log('OCR Space API failed, falling back to Tesseract:', ocrError.message);
      return await tryTesseractOCR(imageUri);
    }

    // Original vision API code (commented out for now)
    /*
    // Get file info to check size
    const fileInfo = await FileSystem.getInfoAsync(imageUri);
    if (fileInfo.size > 20 * 1024 * 1024) {
      throw new Error('Image file is too large. Please use an image smaller than 20MB.');
    }

    // Convert image to base64
    const base64Image = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Prepare the request
    const response = await axios.post(
      API_URL,
      {
        model: VISION_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a medical AI assistant specialized in analyzing cardiovascular health reports. Extract and analyze medical data accurately. Always respond in valid JSON format.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this medical report image carefully. Extract ALL visible text and medical data. Then provide:

1. Complete OCR text extraction
2. Summary of findings
3. Key medical metrics with exact values and normal/abnormal status
4. Risk factors based on the data
5. Specific health recommendations
6. Urgency level (low/medium/high/critical)

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "summary": "Brief summary of findings",
  "keyMetrics": [
    {"name": "Test Name", "value": "Exact value with units", "status": "normal/abnormal/borderline"}
  ],
  "riskFactors": ["List of identified risks"],
  "recommendations": ["List of specific recommendations"],
  "urgency": "low/medium/high/critical"
}

Focus on cardiovascular metrics: blood pressure, cholesterol, heart rate, ECG, blood sugar, etc.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.1,
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
      const analysisText = response.data.choices[0].message.content;
      return parseAnalysisResponse(analysisText);
    } else {
      throw new Error('No response from vision API');
    }
    */
  } catch (error) {
    console.error('Medical Report Analysis Error:', error.message);
    
    // Handle File API errors specifically
    if (error.message.includes('validatePath') || error.message.includes('File')) {
      console.log('File API error detected, trying Tesseract as final fallback...');
      try {
        return await tryTesseractOCR(imageUri);
      } catch (tesseractError) {
        console.error('Tesseract also failed:', tesseractError.message);
        return getEnhancedMockAnalysis();
      }
    }
    
    // Handle other API errors
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your configuration.');
    } else if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    }
    
    // Fallback to enhanced mock response
    console.log('All analysis methods failed, using mock analysis');
    return getEnhancedMockAnalysis();
  }
};

/**
 * Try OpenAI Vision API for image analysis
 */
const tryOpenAIVision = async (imageUri) => {
  try {
    // Check if we have OpenAI API key in environment
    const openaiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
    if (!openaiKey || openaiKey === 'your_openai_api_key_here') {
      console.log('No OpenAI API key configured, using enhanced mock analysis');
      return getEnhancedMockAnalysis();
    }

    // Get file info to check size using new File API
    const file = new File(imageUri);
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Image file is too large. Please use an image smaller than 20MB.');
    }

    // Convert image to base64 using new File API
    const base64Image = await file.base64();

    console.log('Making OpenAI Vision API call...');

    // Prepare the request for OpenAI Vision
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `You are a medical AI assistant specialized in analyzing cardiovascular health reports. Extract and analyze medical data accurately from the image. Always respond in valid JSON format.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this medical report image carefully. Extract ALL visible text and medical data. Then provide:

1. Complete OCR text extraction
2. Summary of findings
3. Key medical metrics with exact values and normal/abnormal status
4. Risk factors based on the data
5. Specific health recommendations
6. Urgency level (low/medium/high/critical)

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "summary": "Brief summary of findings",
  "keyMetrics": [
    {"name": "Test Name", "value": "Exact value with units", "status": "normal/abnormal/borderline"}
  ],
  "riskFactors": ["List of identified risks"],
  "recommendations": ["List of specific recommendations"],
  "urgency": "low/medium/high/critical"
}

Focus on cardiovascular metrics: blood pressure, cholesterol, heart rate, ECG, blood sugar, etc.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.1,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`,
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const analysisText = response.data.choices[0].message.content;
      console.log('OpenAI Vision API response received');
      return parseAnalysisResponse(analysisText);
    } else {
      throw new Error('No response from OpenAI Vision API');
    }
  } catch (error) {
    console.error('OpenAI Vision API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('Invalid OpenAI API key, using enhanced mock analysis');
    } else if (error.response?.status === 429) {
      console.log('OpenAI rate limit exceeded, using enhanced mock analysis');
    } else {
      console.log('OpenAI Vision API failed, using enhanced mock analysis');
    }
    
    // Fallback to enhanced mock response
    return getEnhancedMockAnalysis();
  }
};

/**
 * Try OCR Space API for accurate OCR and image analysis
 */
const tryOCRSpaceAPI = async (imageUri) => {
  try {
    console.log('=== Starting OCR Space API analysis ===');
    console.log('Image URI:', imageUri);
    
    // Get file info to check size using new File API
    let file, base64Image;
    try {
      file = new File(imageUri);
      console.log('File created successfully');
      
      // Check if file exists and get size
      if (file.exists && file.size) {
        console.log('File size:', file.size, 'bytes');
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Image file is too large. Please use an image smaller than 10MB.');
        }
      }

      // Convert image to base64 using new File API
      console.log('Converting image to base64...');
      base64Image = await file.base64();
      console.log('Base64 conversion complete, length:', base64Image.length);
    } catch (fileError) {
      console.error('File API error:', fileError);
      // Fallback to Tesseract if File API fails
      console.log('File API failed, falling back to Tesseract...');
      return await tryTesseractOCR(imageUri);
    }

    console.log('Making OCR Space API call to:', OCR_SPACE_URL);

    // Create form data for OCR Space API
    const formData = new FormData();
    formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
    formData.append('apikey', OCR_SPACE_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('isTable', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2');

    const response = await axios.post(OCR_SPACE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });

    console.log('OCR Space API Response Status:', response.status);
    console.log('OCR Space API Response Data:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.ParsedResults && response.data.ParsedResults.length > 0) {
      const ocrResult = response.data.ParsedResults[0];
      
      if (ocrResult.ErrorMessage) {
        throw new Error(`OCR Space API Error: ${ocrResult.ErrorMessage}`);
      }
      
      const extractedText = ocrResult.ParsedText || '';
      
      if (!extractedText || extractedText.trim().length < 5) {
        throw new Error('No readable text found in the image. Please ensure the image is clear and contains readable text.');
      }

      console.log('OCR Space API completed, analyzing with Groq...');
      
      // Now use Groq to analyze the extracted text
      const analysis = await analyzeExtractedTextWithGroq(extractedText);
      
      // Add OCR Space specific metadata
      analysis.extractedText = extractedText;
      analysis.analysisMethod = 'OCR Space API + Groq AI Analysis';
      analysis.ocrConfidence = ocrResult.TextOverlay?.HasOverlay ? 'High' : 'Medium';
      
      return analysis;
    } else {
      throw new Error('No text detected in the image by OCR Space API');
    }
  } catch (error) {
    console.error('OCR Space API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('OCR Space API key invalid, trying Tesseract fallback...');
      return await tryTesseractOCR(imageUri);
    } else if (error.response?.status === 429) {
      console.log('OCR Space API quota exceeded, trying Tesseract fallback...');
      return await tryTesseractOCR(imageUri);
    } else if (error.message.includes('too large')) {
      throw error; // Re-throw size errors
    }
    
    // Fallback to Tesseract for other errors
    console.log('OCR Space failed, trying Tesseract fallback...');
    return await tryTesseractOCR(imageUri);
  }
};

/**
 * Try Google Vision API for accurate OCR and image analysis (FREE)
 */
const tryGoogleVisionAPI = async (imageUri) => {
  try {
    console.log('Starting Google Vision API analysis...');
    
    // Get file info to check size using new File API
    const file = new File(imageUri);
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Image file is too large. Please use an image smaller than 20MB.');
    }

    // Convert image to base64 using new File API
    const base64Image = await file.base64();

    console.log('Making Google Vision API call for OCR...');

    // Google Vision API - Text Detection (FREE up to 1000 requests/month)
    const response = await axios.post(
      'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBvOkBH0Im_1dGdEFjv-ACgzEBzdg4MVQE',
      {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 50
              },
              {
                type: 'DOCUMENT_TEXT_DETECTION',
                maxResults: 50
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (response.data && response.data.responses && response.data.responses[0]) {
      const visionResult = response.data.responses[0];
      
      // Extract text from the image
      let extractedText = '';
      if (visionResult.fullTextAnnotation) {
        extractedText = visionResult.fullTextAnnotation.text;
      } else if (visionResult.textAnnotations && visionResult.textAnnotations.length > 0) {
        extractedText = visionResult.textAnnotations[0].description;
      }

      console.log('Google Vision OCR completed, analyzing with Groq...');
      
      // Now use Groq to analyze the extracted text
      return await analyzeExtractedTextWithGroq(extractedText);
    } else {
      throw new Error('No text detected in the image');
    }
  } catch (error) {
    console.error('Google Vision API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 403) {
      console.log('Google Vision API quota exceeded, trying alternative...');
      return await tryTesseractOCR(imageUri);
    } else if (error.response?.status === 400) {
      console.log('Invalid image format for Google Vision, trying alternative...');
      return await tryTesseractOCR(imageUri);
    }
    
    // Fallback to Groq text analysis
    console.log('Google Vision failed, using Groq text guidance...');
    return await tryGroqTextAnalysis(imageUri);
  }
};

/**
 * Analyze extracted text using Groq AI
 */
const analyzeExtractedTextWithGroq = async (extractedText) => {
  try {
    console.log('Analyzing extracted text with Groq AI...');
    
    if (!extractedText || extractedText.trim().length < 10) {
      throw new Error('Insufficient text extracted from image');
    }

    // Use Groq to analyze the extracted text
    const response = await axios.post(
      API_URL,
      {
        model: VISION_MODEL, // Use the text model from config
        messages: [
          {
            role: 'system',
            content: `You are CardiagnoAI, a medical AI assistant specialized in analyzing cardiovascular health reports. You will receive OCR text extracted from a medical report image. Analyze this text and provide structured medical insights in JSON format.`
          },
          {
            role: 'user',
            content: `Please analyze this medical report text extracted from an image:

"${extractedText}"

Provide a comprehensive analysis in this exact JSON format:
{
  "summary": "Brief summary of findings",
  "keyMetrics": [
    {"name": "Test Name", "value": "Exact value with units", "status": "normal/abnormal/borderline"}
  ],
  "riskFactors": ["List of identified risks"],
  "recommendations": ["List of specific recommendations"],
  "urgency": "low/medium/high/critical"
}

Focus on cardiovascular metrics like blood pressure, cholesterol, heart rate, ECG findings, blood sugar, etc. Extract exact values and determine if they're normal, abnormal, or borderline based on standard medical ranges.`
          }
        ],
        max_tokens: 1500,
        temperature: 0.1,
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
      const analysisText = response.data.choices[0].message.content;
      console.log('Groq analysis of extracted text completed');
      
      const result = parseAnalysisResponse(analysisText);
      
      // Add the extracted text to the result
      result.extractedText = extractedText;
      result.analysisMethod = 'Google Vision OCR + Groq AI Analysis';
      
      return result;
    } else {
      throw new Error('No response from Groq AI');
    }
  } catch (error) {
    console.error('Groq text analysis failed:', error);
    
    // Return structured response with extracted text
    return {
      summary: `Successfully extracted text from medical report image. Manual review recommended for detailed analysis.`,
      keyMetrics: [
        { name: 'OCR Status', value: 'Text extracted successfully', status: 'normal' },
        { name: 'Text Length', value: `${extractedText.length} characters`, status: 'normal' },
        { name: 'Analysis Method', value: 'Google Vision OCR', status: 'normal' }
      ],
      riskFactors: [
        'Automated analysis unavailable',
        'Manual review of extracted text required'
      ],
      recommendations: [
        'Review the extracted text below for specific values',
        'Compare values with normal medical ranges',
        'Consult healthcare provider for interpretation',
        'Ask specific questions about values in the chat'
      ],
      urgency: 'medium',
      extractedText: extractedText,
      analysisMethod: 'Google Vision OCR Only',
      note: 'Text successfully extracted from image. AI analysis failed, please review manually.'
    };
  }
};

/**
 * Try Tesseract.js for OCR (client-side, free, no API key needed)
 */
const tryTesseractOCR = async (imageUri) => {
  try {
    console.log('=== Starting Tesseract.js OCR analysis ===');
    console.log('Image URI:', imageUri);
    
    // Try to get file info, but don't fail if File API doesn't work
    try {
      const file = new File(imageUri);
      if (file.exists && file.size && file.size > 20 * 1024 * 1024) {
        throw new Error('Image file is too large. Please use an image smaller than 20MB.');
      }
      console.log('File size check passed');
    } catch (fileError) {
      console.log('File API not working, proceeding with Tesseract anyway:', fileError.message);
    }

    console.log('Initializing Tesseract worker...');
    
    // Create Tesseract worker
    const worker = await createWorker('eng');
    
    console.log('Processing image with Tesseract OCR...');
    
    // Perform OCR on the image - Tesseract can work directly with image URIs
    const { data: { text } } = await worker.recognize(imageUri);
    
    // Terminate worker to free memory
    await worker.terminate();
    
    console.log('Tesseract OCR completed, text length:', text.length);
    
    if (!text || text.trim().length < 10) {
      throw new Error('Insufficient text extracted from image. Please ensure the image is clear and contains readable text.');
    }

    // Now use Groq to analyze the extracted text
    console.log('Analyzing extracted text with Groq AI...');
    return await analyzeExtractedTextWithGroq(text);
    
  } catch (error) {
    console.error('Tesseract OCR failed:', error);
    
    // Return helpful error response
    return {
      summary: `Image processing failed: ${error.message}. Please try with a clearer image or different format.`,
      keyMetrics: [
        { name: 'Image Status', value: 'Upload successful', status: 'normal' },
        { name: 'OCR Status', value: 'Processing failed', status: 'abnormal' },
        { name: 'Error Type', value: error.message.substring(0, 50), status: 'abnormal' }
      ],
      riskFactors: [
        'Unable to extract text from image',
        'Image quality may be insufficient',
        'Text may not be clearly visible'
      ],
      recommendations: [
        'Try taking a clearer photo with better lighting',
        'Ensure the medical report text is clearly visible',
        'Try a different image format (JPG, PNG)',
        'Manually type specific values from the report for analysis',
        'Use the chat to ask questions about specific medical values'
      ],
      urgency: 'low',
      analysisMethod: 'Tesseract.js OCR (Failed)',
      note: 'OCR processing failed. Please try with a clearer image or manually enter the medical values.'
    };
  }
};

/**
 * Try Groq Vision API for image analysis
 */
const tryGroqVisionAnalysis = async (imageUri) => {
  try {
    console.log('Starting Groq vision analysis...');
    
    // Get file info to check size using new File API
    const file = new File(imageUri);
    if (file.size > 20 * 1024 * 1024) {
      throw new Error('Image file is too large. Please use an image smaller than 20MB.');
    }

    // Convert image to base64 using new File API
    const base64Image = await file.base64();

    console.log('Making Groq Vision API call...');

    // Try with llama-3.2-90b-vision-preview model (Updated Groq vision model)
    const response = await axios.post(
      API_URL,
      {
        model: 'llama-3.2-90b-vision-preview',
        messages: [
          {
            role: 'system',
            content: `You are a medical AI assistant specialized in analyzing cardiovascular health reports. Extract and analyze medical data accurately from the image. Always respond in valid JSON format.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this medical report image carefully. Extract ALL visible text and medical data. Then provide:

1. Complete OCR text extraction
2. Summary of findings
3. Key medical metrics with exact values and normal/abnormal status
4. Risk factors based on the data
5. Specific health recommendations
6. Urgency level (low/medium/high/critical)

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "summary": "Brief summary of findings",
  "keyMetrics": [
    {"name": "Test Name", "value": "Exact value with units", "status": "normal/abnormal/borderline"}
  ],
  "riskFactors": ["List of identified risks"],
  "recommendations": ["List of specific recommendations"],
  "urgency": "low/medium/high/critical"
}

Focus on cardiovascular metrics: blood pressure, cholesterol, heart rate, ECG, blood sugar, etc.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1500,
        temperature: 0.1,
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
      const analysisText = response.data.choices[0].message.content;
      console.log('Groq Vision API response received');
      return parseAnalysisResponse(analysisText);
    } else {
      throw new Error('No response from Groq Vision API');
    }
  } catch (error) {
    console.error('Groq Vision API Error:', error.response?.data || error.message);
    
    // Check if it's a model-specific error
    if (error.response?.data?.error?.message?.includes('vision') || 
        error.response?.data?.error?.message?.includes('image')) {
      console.log('Groq vision model not available, trying text-based analysis...');
      return await tryGroqTextAnalysis(imageUri);
    }
    
    if (error.response?.status === 401) {
      throw new Error('Invalid Groq API key. Please check your configuration.');
    } else if (error.response?.status === 429) {
      throw new Error('Groq rate limit exceeded. Please try again in a moment.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your internet connection.');
    }
    
    // Fallback to enhanced mock response
    console.log('Groq Vision API failed, using enhanced mock analysis');
    return getEnhancedMockAnalysis();
  }
};

/**
 * Fallback: Use Groq text model to provide guidance about image analysis
 */
const tryGroqTextAnalysis = async (imageUri) => {
  try {
    console.log('Using Groq text model for image analysis guidance...');
    
    // Use the regular Groq text model to provide helpful analysis
    const response = await axios.post(
      API_URL,
      {
        model: VISION_MODEL, // This will use the text model from config
        messages: [
          {
            role: 'system',
            content: `You are CardiagnoAI, a cardiovascular health assistant. The user has uploaded a medical report image, but you cannot see images. Provide helpful guidance about medical report analysis.`
          },
          {
            role: 'user',
            content: `I've uploaded a medical report image for analysis. Since you cannot see the image directly, please provide:
1. General guidance on what to look for in cardiovascular reports
2. Common metrics and their normal ranges
3. When to seek medical attention
4. How to interpret common cardiovascular tests

Format your response as if analyzing a typical cardiovascular report.`
          }
        ],
        max_tokens: 800,
        temperature: 0.3,
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
      const analysisText = response.data.choices[0].message.content;
      
      // Convert the text response to our expected format
      return {
        summary: "Image uploaded successfully. While I cannot directly analyze the image content, here's guidance for cardiovascular report interpretation: " + analysisText.substring(0, 200) + "...",
        keyMetrics: [
          { name: 'Image Status', value: 'Successfully uploaded', status: 'normal' },
          { name: 'Analysis Type', value: 'Text-based guidance', status: 'normal' },
          { name: 'Groq API', value: 'Connected and working', status: 'normal' }
        ],
        riskFactors: [
          'Unable to read specific values from image',
          'Manual review of report recommended'
        ],
        recommendations: [
          'Review the uploaded image manually',
          'Compare values with normal ranges provided',
          'Consult healthcare provider for interpretation',
          'Consider using text input to ask specific questions about values you see'
        ],
        urgency: 'medium',
        note: 'This analysis provides general guidance since direct image reading is not available. Please review your report manually and ask specific questions about any values you see.'
      };
    } else {
      throw new Error('No response from Groq API');
    }
  } catch (error) {
    console.error('Groq text analysis failed:', error);
    return getEnhancedMockAnalysis();
  }
};

/**
 * Basic OCR analysis using free/simple methods
 */
const tryBasicOCRAnalysis = async (imageUri) => {
  try {
    console.log('Attempting basic image analysis...');
    
    // For now, return an informative message about the image
    // In a real implementation, you could use:
    // - Tesseract.js for OCR
    // - Google Vision API free tier
    // - Azure Computer Vision free tier
    
    return {
      summary: "Image uploaded successfully. To get accurate medical report analysis, please configure an OpenAI API key in your .env file. Currently showing sample analysis format.",
      keyMetrics: [
        { name: 'Image Status', value: 'Successfully uploaded', status: 'normal' },
        { name: 'Analysis Type', value: 'Basic processing', status: 'normal' },
        { name: 'API Status', value: 'No vision API configured', status: 'borderline' }
      ],
      riskFactors: [
        'Unable to read actual medical data without vision API',
        'Configure OpenAI API key for real analysis'
      ],
      recommendations: [
        'Add EXPO_PUBLIC_OPENAI_API_KEY to your .env file',
        'Get OpenAI API key from https://platform.openai.com/api-keys',
        'Restart the app after adding the API key',
        'Upload the image again for real analysis'
      ],
      urgency: 'low',
      note: 'This is a placeholder analysis. Real medical data extraction requires a vision API.'
    };
  } catch (error) {
    console.error('Basic OCR analysis failed:', error);
    return getEnhancedMockAnalysis();
  }
};

/**
 * Parse the analysis response from the AI
 */
const parseAnalysisResponse = (responseText) => {
  console.log('Raw AI Response:', responseText);
  
  try {
    // Try to parse as JSON first
    const parsed = JSON.parse(responseText);
    console.log('Parsed JSON successfully:', parsed);
    
    return {
      summary: parsed.summary || 'Analysis completed successfully.',
      keyMetrics: parsed.keyMetrics || [],
      riskFactors: parsed.riskFactors || [],
      recommendations: parsed.recommendations || [],
      urgency: parsed.urgency || 'medium',
    };
  } catch (error) {
    console.log('JSON parsing failed, trying to extract JSON from text...');
    
    // Try to find JSON in the response text
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Extracted JSON from text:', parsed);
        
        return {
          summary: parsed.summary || 'Analysis completed successfully.',
          keyMetrics: parsed.keyMetrics || [],
          riskFactors: parsed.riskFactors || [],
          recommendations: parsed.recommendations || [],
          urgency: parsed.urgency || 'medium',
        };
      } catch (extractError) {
        console.log('Failed to parse extracted JSON:', extractError);
      }
    }
    
    // If all JSON parsing fails, create a structured response from text
    console.log('Creating structured response from text...');
    const lines = responseText.split('\n').filter(line => line.trim());
    
    return {
      summary: responseText.substring(0, 300) + '...',
      keyMetrics: [
        { name: 'Analysis Status', value: 'Completed', status: 'normal' },
        { name: 'Data Extracted', value: `${lines.length} lines processed`, status: 'normal' }
      ],
      riskFactors: ['Please review the detailed analysis for specific risk factors'],
      recommendations: ['Consult with healthcare provider for detailed interpretation', 'Follow up with regular health monitoring'],
      urgency: 'medium',
    };
  }
};

/**
 * Generate enhanced mock analysis for testing/demo purposes
 */
const getEnhancedMockAnalysis = () => {
  const currentDate = new Date().toLocaleDateString();
  
  // Simulate different types of medical reports
  const reportTypes = [
    {
      type: 'Lipid Panel',
      summary: 'Comprehensive lipid panel analysis shows mostly normal cholesterol levels with slightly elevated LDL. Overall cardiovascular risk appears low to moderate.',
      keyMetrics: [
        { name: 'Total Cholesterol', value: '192 mg/dL', status: 'normal' },
        { name: 'LDL Cholesterol', value: '125 mg/dL', status: 'borderline' },
        { name: 'HDL Cholesterol', value: '58 mg/dL', status: 'good' },
        { name: 'Triglycerides', value: '145 mg/dL', status: 'normal' },
        { name: 'VLDL Cholesterol', value: '29 mg/dL', status: 'normal' }
      ],
      riskFactors: ['Slightly elevated LDL cholesterol', 'Borderline triglyceride levels'],
      recommendations: [
        'Increase dietary fiber intake',
        'Reduce saturated fat consumption',
        'Engage in regular aerobic exercise (30 minutes daily)',
        'Consider omega-3 supplements',
        'Recheck lipid panel in 6 months'
      ],
      urgency: 'low'
    },
    {
      type: 'Blood Pressure Analysis',
      summary: 'Blood pressure readings indicate prehypertension stage. Lifestyle modifications recommended to prevent progression to hypertension.',
      keyMetrics: [
        { name: 'Systolic BP', value: '135 mmHg', status: 'borderline' },
        { name: 'Diastolic BP', value: '85 mmHg', status: 'borderline' },
        { name: 'Mean Arterial Pressure', value: '102 mmHg', status: 'normal' },
        { name: 'Pulse Pressure', value: '50 mmHg', status: 'normal' },
        { name: 'Heart Rate', value: '76 bpm', status: 'normal' }
      ],
      riskFactors: ['Prehypertension', 'Increased cardiovascular risk'],
      recommendations: [
        'Reduce sodium intake to <2,300mg/day',
        'Implement DASH eating plan',
        'Maintain healthy weight',
        'Limit alcohol consumption',
        'Monitor BP weekly and track trends'
      ],
      urgency: 'medium'
    },
    {
      type: 'Complete Blood Count',
      summary: 'CBC results are within normal limits. No signs of anemia, infection, or blood disorders detected.',
      keyMetrics: [
        { name: 'Hemoglobin', value: '14.8 g/dL', status: 'normal' },
        { name: 'Hematocrit', value: '44.2%', status: 'normal' },
        { name: 'WBC Count', value: '6.8 x10³/µL', status: 'normal' },
        { name: 'RBC Count', value: '4.95 x10⁶/µL', status: 'normal' },
        { name: 'Platelet Count', value: '285 x10³/µL', status: 'normal' }
      ],
      riskFactors: ['No significant risk factors identified'],
      recommendations: [
        'Continue current health maintenance',
        'Routine CBC monitoring as per healthcare provider schedule',
        'Maintain balanced diet rich in iron and vitamins'
      ],
      urgency: 'low'
    }
  ];

  // Randomly select a report type for variety
  const selectedReport = reportTypes[Math.floor(Math.random() * reportTypes.length)];
  
  return {
    ...selectedReport,
    timestamp: new Date().toISOString(),
    analysisDate: currentDate,
    note: 'This is a simulated analysis for demonstration purposes. Always consult with your healthcare provider for actual medical interpretation.'
  };
};

/**
 * Parses the AI analysis text into structured data
 */
const parseAnalysis = (analysis) => {
  try {
    // Try to parse as JSON first
    const jsonMatch = analysis.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }
  } catch (e) {
    // Fall back to text parsing
  }

  // Extract urgency level
  let urgency = 'Moderate';
  const urgencyMatch = analysis.match(/urgency.*?(low|moderate|high|critical)/i);
  if (urgencyMatch) {
    urgency = urgencyMatch[1].charAt(0).toUpperCase() + urgencyMatch[1].slice(1).toLowerCase();
  }

  // Extract OCR text
  const ocrMatch = analysis.match(/ocr.*?text:?\s*([\s\S]*?)(?=\n\n|key findings|summary|$)/i);
  const ocrText = ocrMatch ? ocrMatch[1].trim() : 'Text extraction not available';

  // Extract risk factors
  const riskFactors = [];
  const riskSection = analysis.match(/risk.*?factors?:?\s*([\s\S]*?)(?=\n\n|recommendations?|$)/i);
  if (riskSection) {
    const risks = riskSection[1].match(/[-•*]\s*(.+?)(?=\n|$)/g);
    if (risks) {
      risks.forEach(risk => {
        const cleaned = risk.replace(/^[-•*]\s*/, '').trim();
        if (cleaned) riskFactors.push(cleaned);
      });
    }
  }

  // Extract recommendations
  const recommendations = [];
  const recSection = analysis.match(/recommendations?:?\s*([\s\S]*?)(?=\n\n|urgency|$)/i);
  if (recSection) {
    const recs = recSection[1].match(/[-•*]\s*(.+?)(?=\n|$)/g);
    if (recs) {
      recs.forEach(rec => {
        const cleaned = rec.replace(/^[-•*]\s*/, '').trim();
        if (cleaned) recommendations.push(cleaned);
      });
    }
  }

  // Extract summary
  const summaryMatch = analysis.match(/summary:?\s*(.+?)(?=\n\n|risk|recommendations?|key)/is);
  const summary = summaryMatch ? summaryMatch[1].trim() : analysis.substring(0, 200) + '...';

  return {
    ocrText,
    summary,
    keyMetrics: [],
    riskFactors: riskFactors.length > 0 ? riskFactors : ['No specific risks identified'],
    recommendations: recommendations.length > 0 ? recommendations : ['Maintain regular health checkups'],
    urgency,
  };
};

/**
 * Gets the color associated with an urgency level
 */
export const getUrgencyColor = (urgency) => {
  const colors = {
    'Low': '#51CF66',
    'Moderate': '#FFB84D',
    'High': '#FF6B6B',
    'Critical': '#E85555',
  };
  return colors[urgency] || colors['Moderate'];
};

/**
 * Gets the icon name for an urgency level
 */
export const getUrgencyIcon = (urgency) => {
  const icons = {
    'Low': 'checkmark-circle',
    'Moderate': 'alert-circle',
    'High': 'warning',
    'Critical': 'alert',
  };
  return icons[urgency] || icons['Moderate'];
};

/**
 * Update API key (to be called when user configures it)
 */
export const updateAPIKey = (apiKey) => {
  // In a real app, this would update securely
  // For now, this is just a placeholder
  console.log('API key would be updated here');
};
