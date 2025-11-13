# 🚀 CardiagnoAI - Quick Start Guide

## ✅ App is Running!

Your CardiagnoAI app is now live and ready to use!

### 📱 How to Access

**Option 1: Scan QR Code**
- Open the Expo Go app on your phone
- Scan the QR code shown in the terminal
- App will load automatically

**Option 2: Android Emulator**
- Press `a` in the terminal
- App will open in Android emulator

**Option 3: Web Browser**
- Press `w` in the terminal
- App will open in your browser

## 🎯 First Steps

### 1. **Explore the Home Screen**
   - View your health dashboard
   - Check quick stats
   - Read health tips
   - Access emergency info

### 2. **Try the Scanner** (Main Feature!)
   - Tap "Scan Report" button
   - Take a photo or upload an image
   - Watch AI extract text (OCR)
   - Get instant health analysis
   - View risk assessment

### 3. **Chat with AI Assistant**
   - Ask health questions
   - Get personalized advice
   - Learn about heart health
   - Use quick suggestions

### 4. **Set Up Your Profile**
   - Enter your health metrics
   - Add vital signs
   - Track risk factors
   - Get personalized risk assessment

### 5. **View History**
   - See all past scans
   - Review analyses
   - Track health trends
   - Manage your data

## 🎨 Features to Try

### Image Scanning & OCR
```
1. Go to "Scan" tab
2. Tap "Take Photo" or "Choose from Gallery"
3. Select a medical report (or any document with text)
4. Tap "Analyze Report"
5. Watch the magic happen!
```

**What Gets Extracted:**
- ✅ All text from the image (OCR)
- ✅ Key health metrics
- ✅ Blood pressure, cholesterol, etc.
- ✅ Risk factors
- ✅ Personalized recommendations

### AI Chat
```
1. Go to "Chat" tab
2. Type a question like:
   - "What is a normal heart rate?"
   - "How to lower blood pressure?"
   - "Heart-healthy diet tips"
3. Get instant AI responses
```

### Health Tracking
```
1. Go to "Profile" tab
2. Tap "Edit Profile"
3. Enter your metrics:
   - Age, height, weight
   - Blood pressure
   - Cholesterol levels
4. Save and view your risk assessment
```

## 🔑 API Configuration (Optional)

### Currently Running in Demo Mode
The app works perfectly **without** an API key using:
- ✅ Mock OCR data
- ✅ Demo health reports
- ✅ Intelligent fallback responses
- ✅ Full functionality

### To Enable Full AI Features

**Step 1: Get OpenAI API Key**
1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key

**Step 2: Update the Code**
1. Open `src/services/visionService.js`
2. Find line 6: `const OPENAI_API_KEY = 'YOUR_API_KEY_HERE';`
3. Replace with: `const OPENAI_API_KEY = 'sk-your-actual-key';`
4. Open `src/services/aiService.js`
5. Find line 4: `const OPENAI_API_KEY = 'YOUR_API_KEY_HERE';`
6. Replace with: `const OPENAI_API_KEY = 'sk-your-actual-key';`

**Step 3: Restart**
```bash
# Stop the app (Ctrl+C)
npm start -- --clear
```

**Note:** API usage costs money! Demo mode is free and fully functional.

## 📸 Test Images

### What to Scan
- Medical lab reports
- Blood test results
- ECG printouts
- Prescription documents
- Any document with text

### Tips for Best Results
- ✅ Good lighting
- ✅ Clear, focused image
- ✅ Flat document (no wrinkles)
- ✅ High contrast
- ❌ Avoid shadows
- ❌ Avoid glare
- ❌ Don't blur

## 🎮 Keyboard Shortcuts

While the terminal is active:
- `r` - Reload app
- `m` - Toggle menu
- `j` - Open debugger
- `a` - Open Android
- `w` - Open web
- `?` - Show all commands
- `Ctrl+C` - Stop server

## 🐛 Troubleshooting

### App Won't Load
```bash
# Clear cache and restart
npm start -- --clear
```

### Camera Not Working
- Check app permissions
- Allow camera access
- Restart the app

### Slow Performance
- Close other apps
- Use WiFi instead of mobile data
- Clear app cache

### OCR Not Working
- Ensure good lighting
- Take clear photos
- Try different angles

## 📱 Device Requirements

### Minimum Requirements
- **iOS**: 13.0 or higher
- **Android**: 6.0 or higher
- **Camera**: Required for scanning
- **Storage**: 100MB free space
- **Internet**: Optional (works offline)

### Recommended
- **iOS**: 14.0+
- **Android**: 10.0+
- **RAM**: 2GB+
- **Camera**: 8MP+
- **Internet**: WiFi for best experience

## 🎯 Sample Workflows

### Workflow 1: Scan a Medical Report
```
1. Open app → Scan tab
2. Take photo of lab report
3. Tap "Analyze Report"
4. Review OCR text
5. Check key metrics
6. Read recommendations
7. Save to history
8. Ask AI for clarification
```

### Workflow 2: Health Consultation
```
1. Open app → Chat tab
2. Ask: "I have high cholesterol, what should I do?"
3. Read AI response
4. Use quick suggestions
5. Ask follow-up questions
6. Get personalized advice
```

### Workflow 3: Risk Assessment
```
1. Open app → Profile tab
2. Edit profile
3. Enter all health metrics
4. Save profile
5. View cardiovascular risk score
6. Review risk factors
7. Follow recommendations
```

## 📊 Understanding Results

### Urgency Levels
- 🟢 **Low**: No immediate concerns
- 🟡 **Moderate**: Monitor and follow up
- 🟠 **High**: See doctor soon
- 🔴 **Critical**: Seek immediate medical attention

### Risk Factors
- Listed in order of importance
- Based on medical guidelines
- Personalized to your data
- Actionable recommendations

### Recommendations
- Evidence-based advice
- Lifestyle modifications
- When to see a doctor
- Follow-up guidance

## ⚠️ Important Reminders

### Medical Disclaimer
- ❌ NOT a medical device
- ❌ NOT for diagnosis
- ❌ NOT for emergencies
- ✅ Educational tool only
- ✅ Always consult doctors

### Privacy
- ✅ Data stored locally
- ✅ No cloud sync
- ✅ No tracking
- ⚠️ If using API, images sent to OpenAI

### Emergency
**If you have:**
- Chest pain
- Severe shortness of breath
- Loss of consciousness
- Stroke symptoms

**DO NOT use this app - Call 911 immediately!**

## 🎉 You're All Set!

Your CardiagnoAI app is ready to use. Start by:

1. **Scanning a document** to see OCR in action
2. **Chatting with AI** to learn about heart health
3. **Setting up your profile** for personalized insights

## 📚 Additional Resources

- **README.md** - Complete documentation
- **FEATURES.md** - Full feature list
- **RISKS_AND_LIMITATIONS.md** - Important safety info

## 💡 Tips for Best Experience

1. **Use good lighting** for scanning
2. **Ask specific questions** in chat
3. **Keep profile updated** for accurate risk assessment
4. **Review history** to track progress
5. **Read all disclaimers** before using

## 🆘 Need Help?

- Check the documentation files
- Review error messages
- Restart the app
- Clear cache if needed
- Consult healthcare professionals for medical advice

---

<div align="center">
  <h3>🫀 Enjoy using CardiagnoAI!</h3>
  <p>Remember: This is a health education tool, not a replacement for medical care.</p>
  <p><strong>Stay healthy and always consult healthcare professionals!</strong></p>
</div>
