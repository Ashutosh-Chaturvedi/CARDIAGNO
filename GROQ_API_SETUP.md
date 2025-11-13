# 🚀 Groq API Setup Guide (FREE)

## Why Groq?
- ✅ **100% FREE** - No credit card required
- ✅ **Fast inference** - Much faster than OpenAI
- ✅ **Generous limits** - 14,400 requests per day on free tier
- ✅ **Easy setup** - Get API key in 2 minutes

## Step 1: Get Your Free API Key

1. **Visit Groq Console**: https://console.groq.com
2. **Sign up** with your email or Google account (takes 30 seconds)
3. **Go to API Keys** section in the dashboard
4. **Create new API key** - Copy it immediately (you won't see it again!)

## Step 2: Configure Your App

1. Open the file: `src/config/localai.js`
2. Find this line:
   ```javascript
   apiKey: 'YOUR_GROQ_API_KEY_HERE',
   ```
3. Replace `YOUR_GROQ_API_KEY_HERE` with your actual Groq API key:
   ```javascript
   apiKey: 'gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
   ```
4. Save the file

## Step 3: Test Your App

1. Start your app:
   ```bash
   npm start
   ```
2. Open the **Chat** tab
3. Ask a question like "What is a healthy heart rate?"
4. You should get an AI-powered response!

## Free Tier Limits

- **Requests**: 14,400 per day (600 per hour)
- **Tokens**: 7,000 per minute
- **Models**: Access to Llama 3.1, Mixtral, and more

This is more than enough for personal use and testing!

## Alternative: OpenAI (Paid)

If you prefer OpenAI instead:

1. Open `src/config/localai.js`
2. Change the provider:
   ```javascript
   provider: 'openai',  // Change from 'groq' to 'openai'
   ```
3. Add your OpenAI API key in the `openai` section
4. Note: OpenAI requires payment after free trial

## Troubleshooting

### "Invalid API key" error
- Double-check you copied the entire key (starts with `gsk_`)
- Make sure there are no extra spaces
- Verify the key is active in Groq console

### "Rate limit exceeded"
- Free tier: 600 requests/hour
- Wait a bit or upgrade to paid tier if needed

### App still using mock responses
- Restart your app after adding the API key
- Check the console for any error messages

## Need Help?

- Groq Documentation: https://console.groq.com/docs
- Groq Discord: https://discord.gg/groq

---

**That's it!** Your app is now powered by free, fast AI. 🎉
