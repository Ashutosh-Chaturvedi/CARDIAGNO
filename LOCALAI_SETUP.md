# 🏠 LocalAI Setup Guide for CardiagnoAI

## What is LocalAI?

LocalAI is a **free, open-source, self-hosted alternative to OpenAI**. It allows you to run AI models locally on your computer, providing:

- ✅ **Complete Privacy** - Your data never leaves your device
- ✅ **No API Costs** - Free to use, no subscription fees
- ✅ **Offline Capable** - Works without internet
- ✅ **Full Control** - Choose your own models
- ✅ **OpenAI Compatible** - Drop-in replacement

## 📋 Prerequisites

- **Docker** installed on your system
- **8GB+ RAM** recommended
- **10GB+ disk space** for models
- **GPU** (optional, but recommended for faster processing)

## 🚀 Quick Start

### Step 1: Start LocalAI Server

Navigate to the LocalAI directory and start the server:

```bash
cd C:\Users\Lenovo\Desktop\LocalAI

# Using Docker Compose (Recommended)
docker-compose up -d

# OR using Docker directly
docker run -p 8080:8080 --name localai -ti localai/localai:latest
```

### Step 2: Verify LocalAI is Running

Open your browser and go to:
```
http://localhost:8080
```

You should see the LocalAI web interface.

### Step 3: Download AI Models

LocalAI needs models to work. You can download them via the web UI or CLI:

**For Chat (Required):**
```bash
# Download a chat model (e.g., Mistral, Llama2)
curl http://localhost:8080/models/apply -H "Content-Type: application/json" -d '{
  "id": "mistral-7b-instruct"
}'
```

**For Vision/OCR (Required for scanning):**
```bash
# Download a vision model
curl http://localhost:8080/models/apply -H "Content-Type: application/json" -d '{
  "id": "llava"
}'
```

### Step 4: Configure CardiagnoAI

Open `src/config/localai.js` and update:

```javascript
export const LOCALAI_CONFIG = {
  baseURL: 'http://localhost:8080',  // LocalAI server URL
  
  models: {
    vision: 'llava',              // Vision model name
    chat: 'mistral-7b-instruct',  // Chat model name
  },
  
  enabled: true,  // Set to true to use LocalAI
  apiKey: '',     // Leave empty (LocalAI doesn't need it)
};
```

### Step 5: Restart CardiagnoAI

```bash
cd C:\Users\Lenovo\Desktop\CARDIAGNO
npm start
```

## 🎯 Recommended Models

### For Chat Assistant
- **Mistral 7B Instruct** - Fast, accurate, great for health advice
- **Llama 2 7B Chat** - Good general knowledge
- **Phi-2** - Smaller, faster, good for basic queries

### For Vision/OCR
- **LLaVA** - Best for image understanding and OCR
- **BakLLaVA** - Alternative vision model
- **MiniGPT-4** - Lighter vision model

## 📱 Using LocalAI with CardiagnoAI

### Network Configuration

If running LocalAI on your computer and testing the app on a phone:

1. Find your computer's local IP address:
   ```bash
   # Windows
   ipconfig
   
   # Look for IPv4 Address (e.g., 192.168.1.100)
   ```

2. Update `src/config/localai.js`:
   ```javascript
   baseURL: 'http://192.168.1.100:8080',  // Use your IP
   ```

3. Make sure your phone and computer are on the same WiFi network

### Testing the Connection

Test if LocalAI is accessible:

```bash
# From your computer
curl http://localhost:8080/v1/models

# From your phone (use computer's IP)
curl http://192.168.1.100:8080/v1/models
```

## 🔧 Advanced Configuration

### GPU Acceleration (NVIDIA)

For faster processing with NVIDIA GPU:

```bash
docker run -p 8080:8080 --gpus all --name localai localai/localai:latest-gpu
```

### Custom Model Configuration

Create a model configuration file in LocalAI:

```yaml
# models/mistral-medical.yaml
name: mistral-medical
backend: llama
parameters:
  model: mistral-7b-instruct-v0.2.Q4_K_M.gguf
  temperature: 0.7
  top_k: 40
  top_p: 0.9
  max_tokens: 512
context_size: 4096
```

### Performance Tuning

Edit `docker-compose.yml`:

```yaml
environment:
  - THREADS=8              # CPU threads
  - CONTEXT_SIZE=4096      # Context window
  - MODELS_PATH=/models    # Model directory
```

## 🐛 Troubleshooting

### LocalAI Not Starting

```bash
# Check Docker is running
docker ps

# View LocalAI logs
docker logs localai

# Restart LocalAI
docker restart localai
```

### Connection Refused

- Verify LocalAI is running: `docker ps`
- Check firewall settings
- Ensure port 8080 is not blocked
- Try using `127.0.0.1` instead of `localhost`

### Slow Responses

- Use smaller models (7B instead of 13B)
- Enable GPU acceleration
- Increase allocated RAM
- Reduce context size

### Model Not Found

```bash
# List available models
curl http://localhost:8080/v1/models

# Download missing model
curl http://localhost:8080/models/apply -H "Content-Type: application/json" -d '{
  "id": "model-name"
}'
```

## 📊 Performance Comparison

| Feature | LocalAI | OpenAI |
|---------|---------|--------|
| **Cost** | Free | $0.01-0.03 per request |
| **Privacy** | 100% Private | Data sent to OpenAI |
| **Speed** | Depends on hardware | Fast (cloud-based) |
| **Offline** | Yes | No |
| **Setup** | Requires installation | Just API key |
| **Models** | Choose your own | Fixed models |

## 🔄 Switching Between LocalAI and OpenAI

You can easily switch between LocalAI and OpenAI:

**Use LocalAI:**
```javascript
// src/config/localai.js
enabled: true,
```

**Use OpenAI:**
```javascript
// src/config/localai.js
enabled: false,
```

Then update API keys in:
- `src/services/visionService.js`
- `src/services/aiService.js`

## 📚 Additional Resources

- **LocalAI Documentation**: https://localai.io/
- **Model Gallery**: https://localai.io/models/
- **GitHub**: https://github.com/mudler/LocalAI
- **Discord Community**: https://discord.gg/uJAeKSAGDy

## ⚠️ Important Notes

### Privacy
- LocalAI processes everything locally
- No data is sent to external servers
- Perfect for sensitive medical information

### Hardware Requirements
- **Minimum**: 8GB RAM, 4 CPU cores
- **Recommended**: 16GB RAM, 8 CPU cores, GPU
- **Optimal**: 32GB RAM, GPU with 8GB+ VRAM

### Model Selection
- Larger models (13B+) = Better quality, slower
- Smaller models (7B) = Faster, good quality
- Quantized models (Q4, Q5) = Smaller size, faster

## 🎉 Benefits for CardiagnoAI

Using LocalAI with CardiagnoAI provides:

1. **Complete Privacy** - Medical data stays on your device
2. **No Costs** - Unlimited scans and chats for free
3. **Offline Use** - Works without internet
4. **Customization** - Fine-tune models for medical use
5. **Control** - Full control over AI behavior

## 🚀 Next Steps

1. ✅ Start LocalAI server
2. ✅ Download required models
3. ✅ Configure CardiagnoAI
4. ✅ Test the connection
5. ✅ Start scanning medical reports!

---

**Need Help?** Check the LocalAI documentation or ask in their Discord community!
