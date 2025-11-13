import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { sendMessageToAI } from '../services/aiService';
import { analyzeMedicalReport } from '../services/visionService';
import { getChatHistory, saveChatMessage, clearChatHistory } from '../utils/storage';
import { THEME } from '../constants/theme';

const { width } = Dimensions.get('window');

export const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const history = await getChatHistory();
      setMessages(history);
      
      // Add welcome message if no history
      if (history.length === 0) {
        const welcomeMessage = {
          id: 'welcome',
          text: "Hello! I'm CardiagnoAI, your heart health assistant. I can help you with:\n\n• Understanding heart health metrics\n• Analyzing medical reports with photos 📸\n• Lifestyle and diet advice\n• Exercise recommendations\n• Stress management\n\nYou can type questions or upload/take photos of medical reports for analysis. What would you like to know about your heart health today?",
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    try {
      // Add user message to chat
      const savedUserMessage = await saveChatMessage(userMessage);
      setMessages(prev => [...prev, savedUserMessage]);
      setInputText('');
      setIsLoading(true);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

      // Get AI response
      const aiResponse = await sendMessageToAI(userMessage.text, messages);
      
      const aiMessage = {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };

      // Save and add AI message
      const savedAiMessage = await saveChatMessage(aiMessage);
      setMessages(prev => [...prev, savedAiMessage]);

      // Scroll to bottom again
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);

    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Error',
        'Failed to send message. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const pickImageFromLibrary = async () => {
    try {
      console.log('Starting image picker for library...');
      
      // On web, permissions are handled differently
      if (Platform.OS === 'web') {
        console.log('Web platform detected, skipping permission check');
      } else {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
          Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: false, // Don't need base64 for web
      });

      console.log('Image picker result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Image selected:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      } else {
        console.log('Image picker was canceled or no image selected');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', `Failed to pick image from library: ${error.message}`);
    }
  };

  const takePhoto = async () => {
    try {
      console.log('Starting camera...');
      
      // On web, camera might not be available
      if (Platform.OS === 'web') {
        Alert.alert(
          'Camera Not Available', 
          'Camera is not available on web. Please use "Photo Library" to upload an image file instead.',
          [{ text: 'OK' }]
        );
        return;
      }

      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please allow camera access to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      console.log('Camera result:', result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log('Photo taken:', result.assets[0].uri);
        setSelectedImage(result.assets[0].uri);
        await analyzeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', `Failed to take photo: ${error.message}`);
    }
  };

  const showImagePicker = () => {
    console.log('showImagePicker called, platform:', Platform.OS);
    
    if (Platform.OS === 'web') {
      // On web, directly open file picker
      console.log('Web platform: opening file picker directly');
      pickImageFromLibrary();
    } else {
      // On mobile, show options
      Alert.alert(
        'Add Photo',
        'Choose how you want to add a photo for analysis:',
        [
          { text: 'Camera', onPress: takePhoto },
          { text: 'Photo Library', onPress: pickImageFromLibrary },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  const analyzeImage = async (imageUri) => {
    try {
      setIsAnalyzing(true);
      
      // Add user message with image
      const userMessage = {
        text: 'Please analyze this medical report:',
        sender: 'user',
        timestamp: new Date().toISOString(),
        image: imageUri,
      };
      
      const savedUserMessage = await saveChatMessage(userMessage);
      setMessages(prev => [...prev, savedUserMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // Analyze the image
      const analysis = await analyzeMedicalReport(imageUri);
      
      // Format the analysis response
      let analysisText = `## Medical Report Analysis\n\n**Summary:** ${analysis.summary}\n\n`;
      
      if (analysis.keyMetrics && analysis.keyMetrics.length > 0) {
        analysisText += `**Key Metrics:**\n`;
        analysis.keyMetrics.forEach(metric => {
          const statusEmoji = metric.status === 'normal' ? '✅' : metric.status === 'borderline' ? '⚠️' : '❌';
          analysisText += `• ${metric.name}: ${metric.value} ${statusEmoji}\n`;
        });
        analysisText += '\n';
      }
      
      if (analysis.riskFactors && analysis.riskFactors.length > 0) {
        analysisText += `**Risk Factors:**\n`;
        analysis.riskFactors.forEach(risk => {
          analysisText += `• ${risk}\n`;
        });
        analysisText += '\n';
      }
      
      if (analysis.recommendations && analysis.recommendations.length > 0) {
        analysisText += `**Recommendations:**\n`;
        analysis.recommendations.forEach(rec => {
          analysisText += `• ${rec}\n`;
        });
        analysisText += '\n';
      }
      
      const urgencyEmoji = analysis.urgency === 'low' ? '🟢' : analysis.urgency === 'medium' ? '🟡' : analysis.urgency === 'high' ? '🟠' : '🔴';
      analysisText += `**Urgency Level:** ${analysis.urgency} ${urgencyEmoji}\n\n`;
      
      // Add extracted text if available
      if (analysis.extractedText) {
        analysisText += `**Extracted Text from Image:**\n"${analysis.extractedText.substring(0, 500)}${analysis.extractedText.length > 500 ? '...' : ''}"\n\n`;
      }
      
      // Add analysis method if available
      if (analysis.analysisMethod) {
        analysisText += `**Analysis Method:** ${analysis.analysisMethod}\n\n`;
      }
      
      analysisText += `*Please consult with your healthcare provider for professional medical interpretation.*`;
      
      const aiMessage = {
        text: analysisText,
        sender: 'ai',
        timestamp: new Date().toISOString(),
      };
      
      const savedAiMessage = await saveChatMessage(aiMessage);
      setMessages(prev => [...prev, savedAiMessage]);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Analysis Error', 'Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setSelectedImage(null);
    }
  };

  const clearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to clear all chat messages?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearChatHistory();
              setMessages([]);
              loadChatHistory(); // This will add the welcome message back
            } catch (error) {
              console.error('Error clearing chat:', error);
              Alert.alert('Error', 'Failed to clear chat history');
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
          {item.image && (
            <Image 
              source={{ uri: item.image }} 
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}
          <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isUser ? styles.userTime : styles.aiTime]}>
            {messageTime}
          </Text>
        </View>
      </View>
    );
  };

  if (isLoadingHistory) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
        <Text style={styles.loadingText}>Loading chat history...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 40}
    >
      {/* Chat Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id || item.timestamp}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Loading indicator */}
      {(isLoading || isAnalyzing) && (
        <View style={styles.loadingIndicator}>
          <ActivityIndicator size="small" color={THEME.colors.primary} />
          <Text style={styles.loadingIndicatorText}>
            {isAnalyzing ? 'Analyzing image...' : 'AI is thinking...'}
          </Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={showImagePicker}
            disabled={isLoading || isAnalyzing}
          >
            <Ionicons 
              name="camera" 
              size={20} 
              color={(isLoading || isAnalyzing) ? THEME.colors.textSecondary : THEME.colors.primary} 
            />
          </TouchableOpacity>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about your heart health or upload a photo..."
            placeholderTextColor={THEME.colors.textSecondary}
            multiline
            maxLength={500}
            editable={!isLoading && !isAnalyzing}
            textAlignVertical="center"
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isLoading || isAnalyzing) && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading || isAnalyzing}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={(!inputText.trim() || isLoading || isAnalyzing) ? THEME.colors.textSecondary : THEME.colors.textWhite} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Action Buttons Row */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={showImagePicker}>
            <Ionicons name="image-outline" size={16} color={THEME.colors.textSecondary} />
            <Text style={styles.actionButtonText}>
              {Platform.OS === 'web' ? 'Upload Image' : 'Add Photo'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={clearChat}>
            <Ionicons name="trash-outline" size={16} color={THEME.colors.textSecondary} />
            <Text style={styles.actionButtonText}>Clear Chat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: THEME.colors.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: THEME.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  messageText: {
    fontSize: THEME.fonts.sizes.sm,
    lineHeight: 20,
  },
  userText: {
    color: THEME.colors.textWhite,
  },
  aiText: {
    color: THEME.colors.textPrimary,
  },
  messageTime: {
    fontSize: THEME.fonts.sizes.xs,
    marginTop: 4,
    opacity: 0.7,
  },
  userTime: {
    color: THEME.colors.textWhite,
    textAlign: 'right',
  },
  aiTime: {
    color: THEME.colors.textSecondary,
  },
  loadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadingIndicatorText: {
    marginLeft: 8,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textSecondary,
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: THEME.colors.surface,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.border,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 32,
    minHeight: 100,
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    paddingHorizontal: 4,
    paddingVertical: 4,
    marginBottom: 8,
    minHeight: 50,
  },
  photoButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    fontSize: THEME.fonts.sizes.sm,
    color: THEME.colors.textPrimary,
    maxHeight: 100,
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  sendButton: {
    backgroundColor: THEME.colors.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  sendButtonDisabled: {
    backgroundColor: THEME.colors.border,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: Platform.OS === 'ios' ? 8 : 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: THEME.colors.background,
  },
  actionButtonText: {
    fontSize: THEME.fonts.sizes.xs,
    color: THEME.colors.textSecondary,
    marginLeft: 4,
  },
  messageImage: {
    width: width * 0.6,
    height: width * 0.45,
    borderRadius: 8,
    marginBottom: 8,

  },
});
