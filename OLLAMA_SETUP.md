# 🦙 Ollama Setup Guide for CardiagnoAI

## What is Ollama?

**Ollama** is a lightweight, easy-to-use alternative to run AI models locally. It's:

- ✅ **Easier than LocalAI** - No Docker required
- ✅ **Windows Native** - Simple installer
- ✅ **Free & Private** - Runs on your computer
- ✅ **Fast Setup** - Ready in minutes
- ✅ **OpenAI Compatible** - Works with CardiagnoAI

## 🚀 Quick Setup (5 Minutes)

### Step 1: Download Ollama

1. Go to: https://ollama.com/download
2. Download **Ollama for Windows**
3. Run the installer
4. Follow the installation wizard

### Step 2: Install AI Models

Open PowerShell or Command Prompt and run:

```bash
# Install chat model (required)
ollama pull llama3.2

# Install vision model (required for scanning)
ollama pull llava
```

### Step 3: Verify Installation

```bash
# Check if Ollama is running
ollama list

# Test the chat model
ollama run llama3.2 "Hello, how are you?"
```

### Step 4: Configure CardiagnoAI

Update `src/config/localai.js`:

```javascript
export const LOCALAI_CONFIG = {
  baseURL: 'http://localhost:11434',  // Ollama default port
  
  models: {
    vision: 'llava',        // Vision model for scanning
    chat: 'llama3.2',       // Chat model
  },
  
  enabled: true,
  apiKey: '',  // Not needed for Ollama
};
```

### Step 5: Start Using!

```bash
cd C:\Users\Lenovo\Desktop\CARDIAGNO
npm start
```

## 🎯 Recommended Models

### For Chat (Choose ONE)
```bash
# Best overall (Recommended)
ollama pull llama3.2

# Faster, smaller
ollama pull phi3

# Medical-focused
ollama pull meditron

# Very fast, good quality
ollama pull mistral
```

### For Vision/OCR (Choose ONE)
```bash
# Best for images (Recommended)
ollama pull llava

# Alternative
ollama pull bakllava

# Smaller, faster
ollama pull llava:7b
```

## 📱 Using with Your Phone

If testing CardiagnoAI on your phone:

1. **Find your computer's IP:**
   ```bash
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. **Update config:**
   ```javascript
   // src/config/localai.js
   baseURL: 'http://192.168.1.100:11434',
   ```

3. **Allow firewall access:**
   - Windows will prompt to allow Ollama
   - Click "Allow access"

## 🔧 Ollama Commands

```bash
# List installed models
ollama list

# Pull a new model
ollama pull <model-name>

# Remove a model
ollama rm <model-name>

# Run a model interactively
ollama run <model-name>

# Show model info
ollama show <model-name>

# Stop Ollama
# (Close from system tray)
```

## ⚡ Performance Tips

### Speed Up Responses
```bash
# Use smaller models
ollama pull llama3.2:8b  # Instead of 70b

# Use quantized versions
ollama pull llama3.2:q4_0
```

### Save Disk Space
```bash
# Remove unused models
ollama rm <model-name>

# Use smaller variants
ollama pull phi3:mini
```

## 🐛 Troubleshooting

### Ollama Not Running
```bash
# Check if running
ollama list

# Restart Ollama
# Right-click Ollama icon in system tray → Restart
```

### Model Download Failed
```bash
# Try again
ollama pull <model-name>

# Check internet connection
ping ollama.com
```

### Connection Refused from Phone
- Ensure computer and phone on same WiFi
- Check Windows Firewall settings
- Try using computer's IP instead of localhost

### Slow Responses
- Use smaller models (8b instead of 70b)
- Close other applications
- Ensure sufficient RAM available

## 📊 Model Comparison

| Model | Size | Speed | Quality | Best For |
|-------|------|-------|---------|----------|
| **llama3.2** | 4.7GB | Fast | Excellent | General use ⭐ |
| **phi3** | 2.3GB | Very Fast | Good | Quick responses |
| **mistral** | 4.1GB | Fast | Excellent | Balanced |
| **llava** | 4.7GB | Medium | Excellent | Vision/OCR ⭐ |
| **meditron** | 4.1GB | Fast | Good | Medical queries |

## 🔄 API Compatibility

Ollama uses OpenAI-compatible API:

```javascript
// CardiagnoAI automatically handles this!

// Chat endpoint
POST http://localhost:11434/v1/chat/completions

// Models endpoint
GET http://localhost:11434/v1/models
```

## 💡 Pro Tips

1. **Keep Ollama Running**
   - Ollama runs in the background
   - Check system tray for icon

2. **Update Models**
   ```bash
   ollama pull llama3.2  # Gets latest version
   ```

3. **Multiple Models**
   - Install multiple models
   - Switch in config file
   - No need to uninstall others

4. **GPU Acceleration**
   - Ollama automatically uses GPU if available
   - NVIDIA, AMD, and Intel GPUs supported

## 🆚 Ollama vs LocalAI vs OpenAI

| Feature | Ollama | LocalAI | OpenAI |
|---------|--------|---------|--------|
| **Setup** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Medium | ⭐⭐⭐⭐⭐ Easy |
| **Cost** | Free | Free | Paid |
| **Privacy** | 100% | 100% | Cloud |
| **Speed** | Fast | Fast | Very Fast |
| **Windows** | Native | Docker | API |
| **Models** | Many | Many | Fixed |

## ✅ Why Ollama for CardiagnoAI?

1. **No Docker** - Simple Windows installer
2. **Easy Setup** - 5 minutes to start
3. **Great Models** - LLaMA, Mistral, LLaVA
4. **Auto Updates** - Built-in model updates
5. **Low Resource** - Works on modest hardware
6. **Perfect for Medical** - Privacy-focused

## 🚀 Next Steps

1. ✅ Download Ollama from https://ollama.com
2. ✅ Install llama3.2 and llava models
3. ✅ Update CardiagnoAI config
4. ✅ Start scanning medical reports!

---

**Download Ollama:** https://ollama.com/download

**Need Help?** Visit https://ollama.com/docs
