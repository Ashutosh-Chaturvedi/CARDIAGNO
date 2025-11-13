# 🤖 AI Setup for CardiagnoAI

## Choose Your AI Backend

CardiagnoAI supports **3 options** for AI functionality:

### Option 1: 🦙 Ollama (RECOMMENDED - Easiest!)

**Best for:** Everyone, especially beginners

✅ **Pros:**
- No Docker required
- Simple Windows installer
- Free and private
- Fast setup (5 minutes)
- Great models available

❌ **Cons:**
- Requires download (~5GB models)
- Needs decent computer (8GB+ RAM)

**Setup:**
1. Run `SETUP_OLLAMA.bat` OR
2. Follow `OLLAMA_SETUP.md`

---

### Option 2: 🏠 LocalAI (Advanced)

**Best for:** Advanced users with Docker

✅ **Pros:**
- More model options
- Highly customizable
- Free and private

❌ **Cons:**
- Requires Docker
- More complex setup
- Larger resource usage

**Setup:**
Follow `LOCALAI_SETUP.md`

---

### Option 3: ☁️ OpenAI (Cloud)

**Best for:** Quick testing, don't want local setup

✅ **Pros:**
- No installation
- Very fast
- Latest models

❌ **Cons:**
- Costs money ($0.01-0.03 per scan)
- Data sent to OpenAI
- Requires internet
- Privacy concerns

**Setup:**
1. Get API key from https://platform.openai.com/api-keys
2. Edit `src/config/localai.js`:
   ```javascript
   enabled: false,  // Disable local AI
   ```
3. Edit `src/services/visionService.js` line 6:
   ```javascript
   const OPENAI_API_KEY = 'sk-your-actual-key-here';
   ```
4. Edit `src/services/aiService.js` line 5:
   ```javascript
   const OPENAI_API_KEY = 'sk-your-actual-key-here';
   ```

---

## 🚀 Quick Start (Recommended Path)

### For Most Users: Use Ollama

```bash
# 1. Run the setup script
SETUP_OLLAMA.bat

# 2. Start CardiagnoAI
npm start

# 3. Start using!
```

That's it! Your app now has:
- ✅ Private AI (data stays on your computer)
- ✅ Free unlimited scans and chats
- ✅ Works offline
- ✅ No API costs

---

## 📊 Comparison Table

| Feature | Ollama | LocalAI | OpenAI |
|---------|--------|---------|--------|
| **Setup Time** | 5 min | 30 min | 2 min |
| **Cost** | Free | Free | ~$10/month |
| **Privacy** | 100% Private | 100% Private | Cloud-based |
| **Internet** | Optional | Optional | Required |
| **Quality** | Excellent | Excellent | Excellent |
| **Speed** | Fast | Fast | Very Fast |
| **Difficulty** | ⭐ Easy | ⭐⭐⭐ Hard | ⭐ Easy |

---

## 🎯 Which Should I Choose?

### Choose **Ollama** if:
- ✅ You want easy setup
- ✅ You care about privacy
- ✅ You don't want monthly costs
- ✅ You have 8GB+ RAM
- ✅ You want offline capability

### Choose **LocalAI** if:
- ✅ You're comfortable with Docker
- ✅ You want maximum customization
- ✅ You need specific models
- ✅ You're technically advanced

### Choose **OpenAI** if:
- ✅ You want instant setup
- ✅ You don't mind cloud processing
- ✅ You're okay with costs
- ✅ You want the absolute best quality
- ✅ You're just testing the app

---

## 🔄 Switching Between Options

You can easily switch:

**To use Ollama/LocalAI:**
```javascript
// src/config/localai.js
enabled: true,
baseURL: 'http://localhost:11434',  // Ollama
// OR
baseURL: 'http://localhost:8080',   // LocalAI
```

**To use OpenAI:**
```javascript
// src/config/localai.js
enabled: false,
```

---

## ⚡ Quick Commands

### Ollama
```bash
# Install models
ollama pull llama3.2
ollama pull llava

# List models
ollama list

# Test
ollama run llama3.2 "Hello!"
```

### LocalAI
```bash
# Start server
cd LocalAI
docker-compose up -d

# Check status
docker ps
```

### OpenAI
```bash
# Test API key
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## 🆘 Need Help?

1. **Ollama Issues:** Check `OLLAMA_SETUP.md`
2. **LocalAI Issues:** Check `LOCALAI_SETUP.md`
3. **OpenAI Issues:** Visit https://platform.openai.com/docs
4. **App Issues:** Check `README.md`

---

## 🎉 Recommended Setup

**For best experience:**

1. **Install Ollama** (5 minutes)
2. **Download models** (llama3.2 + llava)
3. **Start using CardiagnoAI**
4. **Enjoy free, private AI!**

---

**Ready to start?** Run `SETUP_OLLAMA.bat` now! 🚀
