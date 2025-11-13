# CardiagnoAI - AI-Powered Heart Health Monitor

<div align="center">
  <h3>🫀 Your Personal Cardiovascular Health Assistant</h3>
  <p>Advanced medical report scanning with OCR, AI analysis, and personalized health insights</p>
</div>

## 🌟 Features

### 📸 Medical Report Scanner
- **Advanced OCR Technology**: Extract text from medical documents with high accuracy
- **Image Recognition**: Supports lab results, ECG reports, prescriptions, and more
- **AI-Powered Analysis**: Automatically identifies key health metrics
- **Risk Assessment**: Evaluates cardiovascular risk factors
- **Personalized Recommendations**: Get actionable health advice

### 💬 AI Health Assistant
- **24/7 Availability**: Ask health questions anytime
- **Context-Aware**: Remembers conversation history
- **Evidence-Based**: Provides medically accurate information
- **Empathetic Responses**: Supportive and easy to understand
- **Emergency Guidance**: Recognizes urgent symptoms

### 📊 Health Tracking
- **BMI Calculator**: Track your body mass index
- **Blood Pressure Monitoring**: Record and analyze BP readings
- **Cholesterol Tracking**: Monitor lipid panel results
- **Risk Assessment**: Comprehensive cardiovascular risk evaluation
- **History Management**: View all past scans and analyses

### 👤 Personal Profile
- **Health Metrics**: Store age, weight, height, and vital signs
- **Risk Factors**: Track smoking, diabetes, family history
- **Progress Tracking**: Monitor health improvements over time
- **Secure Storage**: All data stored locally on your device

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator or physical device

### Installation

1. **Clone or navigate to the project**
   ```bash
   cd CARDIAGNO
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on your device**
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w`

## 🔑 API Configuration

### 🎉 FREE Option: Groq API (Recommended)

Get **FREE, fast AI** with no credit card required!

1. **Get your free API key** at [console.groq.com](https://console.groq.com)
2. **Configure the app**:
   - Open `src/config/localai.js`
   - Replace `YOUR_GROQ_API_KEY_HERE` with your Groq API key
3. **Restart the app**:
   ```bash
   npm start -- --clear
   ```

📖 **Detailed setup guide**: See [GROQ_API_SETUP.md](./GROQ_API_SETUP.md)

**Free tier includes**:
- ✅ 14,400 requests per day
- ✅ Fast inference (faster than OpenAI)
- ✅ No credit card required
- ✅ Access to Llama 3.1 and vision models

### 💰 Paid Option: OpenAI API

If you prefer OpenAI:
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Open `src/config/localai.js`
3. Change `provider: 'groq'` to `provider: 'openai'`
4. Add your OpenAI key in the `openai` section

**Note**: The app works with demo data if no API key is configured!

## 📱 App Structure

```
CARDIAGNO/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── HeartIcon.js
│   ├── constants/           # Theme and colors
│   │   ├── theme.js
│   │   └── colors.js
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.js
│   ├── screens/             # Main app screens
│   │   ├── HomeScreen.js
│   │   ├── ScanScreen.js
│   │   ├── ChatScreen.js
│   │   ├── HistoryScreen.js
│   │   └── ProfileScreen.js
│   ├── services/            # API services
│   │   ├── visionService.js
│   │   └── aiService.js
│   └── utils/               # Helper functions
│       ├── storage.js
│       └── healthMetrics.js
├── App.js                   # Main app entry
└── package.json
```

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface
- **Smooth Animations**: Haptic feedback and transitions
- **Responsive Layout**: Works on all screen sizes
- **Accessibility**: High contrast, readable fonts
- **Dark Mode Ready**: Theme system prepared for dark mode

## 🔒 Privacy & Security

- ✅ **Local Storage**: All data stored on your device
- ✅ **No Cloud Sync**: Your health data stays private
- ✅ **Secure**: No data collection or tracking
- ✅ **HIPAA Aware**: Designed with medical privacy in mind

## ⚠️ Possible Risks & Limitations

### Medical Disclaimer
- **NOT a Medical Device**: This app is for informational purposes only
- **NOT a Diagnosis Tool**: Cannot diagnose medical conditions
- **NOT a Replacement**: Does not replace professional medical advice
- **Emergency**: For serious symptoms, call emergency services immediately

### Technical Limitations
- **OCR Accuracy**: Text extraction may not be 100% accurate
- **Image Quality**: Requires clear, well-lit photos
- **AI Limitations**: AI analysis should be verified by healthcare professionals
- **Internet Required**: Full AI features need internet connection
- **API Costs**: Using OpenAI API may incur costs

### Data Risks
- **Device Loss**: Data lost if device is lost/damaged (no cloud backup)
- **App Deletion**: Uninstalling removes all data
- **Storage**: Large image files may use device storage

### Privacy Considerations
- **API Usage**: If using OpenAI API, images are sent to OpenAI servers
- **Network**: Ensure secure network when transmitting health data
- **Screenshots**: Be careful sharing screenshots of health data

## 🛠️ Troubleshooting

### App won't start
```bash
# Clear cache and restart
npm start -- --clear
```

### Camera not working
- Check app permissions in device settings
- Restart the app

### OCR not extracting text
- Ensure good lighting
- Take clear, focused photos
- Try different angles

### AI not responding
- Check internet connection
- Verify API key is configured (if using)
- App works offline with demo responses

## 📋 Roadmap

- [ ] Dark mode support
- [ ] Export reports as PDF
- [ ] Medication reminders
- [ ] Health goal tracking
- [ ] Integration with health apps
- [ ] Multi-language support
- [ ] Voice input for chat
- [ ] Wearable device integration

## 🤝 Contributing

This is a personal health app. For suggestions or issues, please create an issue in the repository.

## 📄 License

This project is for educational and personal use only.

## 🙏 Acknowledgments

- Built with React Native & Expo
- UI Icons by Ionicons
- AI powered by OpenAI (optional)
- Health metrics calculations based on medical guidelines

## 📞 Support

For questions or support:
- Check the in-app Help section
- Review this README
- Consult with healthcare professionals for medical advice

---

<div align="center">
  <p><strong>Made with ❤️ for better heart health</strong></p>
  <p>Remember: This app is a tool, not a doctor. Always consult healthcare professionals for medical advice.</p>
</div>
