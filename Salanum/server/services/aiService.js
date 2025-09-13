const OpenAI = require('openai');
const crypto = require('crypto');

class AIService {
  constructor() {
    this.openai = null;
    this.maskingStrategies = [
      'synonym_replacement',
      'context_obfuscation',
      'semantic_shifting',
      'noise_injection'
    ];
  }

  async initialize() {
    try {
      if (!process.env.OPENAI_API_KEY) {
        console.warn('⚠️ OpenAI API key not provided. AI features will be disabled.');
        return;
      }

      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Test the connection
      await this.testConnection();
      console.log('AI service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      const response = await this.openai.models.list();
      console.log('✅ OpenAI connection successful');
    } catch (error) {
      console.error('❌ OpenAI connection failed:', error);
      throw error;
    }
  }

  // Generate masked version of message
  async maskMessage(originalMessage, userKey, maskingLevel = 'medium') {
    try {
      if (!this.openai) {
        return this.fallbackMasking(originalMessage, userKey);
      }

      const strategy = this.selectMaskingStrategy(maskingLevel);
      
      const prompt = this.buildMaskingPrompt(originalMessage, strategy);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a privacy protection AI. Your job is to create semantically similar but different versions of messages to protect user privacy while maintaining readability for the intended recipient."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      const maskedMessage = response.choices[0].message.content.trim();
      
      // Generate decryption key for this specific message
      const messageKey = this.generateMessageKey(originalMessage, userKey);
      
      return {
        maskedMessage,
        messageKey,
        strategy,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to mask message:', error);
      return this.fallbackMasking(originalMessage, userKey);
    }
  }

  // Unmask message using user's key
  async unmaskMessage(maskedMessage, messageKey, userKey) {
    try {
      if (!this.openai) {
        return this.fallbackUnmasking(maskedMessage, messageKey, userKey);
      }

      const prompt = `This message was masked for privacy. The original context was: "${maskedMessage}". Please help restore the original meaning while maintaining privacy.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are helping to restore the original meaning of a masked message. Provide the most likely original message based on the masked version."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Failed to unmask message:', error);
      return this.fallbackUnmasking(maskedMessage, messageKey, userKey);
    }
  }

  // Select appropriate masking strategy
  selectMaskingStrategy(level) {
    const strategies = {
      low: ['synonym_replacement'],
      medium: ['synonym_replacement', 'context_obfuscation'],
      high: ['semantic_shifting', 'context_obfuscation'],
      maximum: ['semantic_shifting', 'noise_injection']
    };

    const availableStrategies = strategies[level] || strategies.medium;
    return availableStrategies[Math.floor(Math.random() * availableStrategies.length)];
  }

  // Build masking prompt based on strategy
  buildMaskingPrompt(message, strategy) {
    const prompts = {
      synonym_replacement: `Replace key words in this message with synonyms while keeping the same meaning: "${message}"`,
      context_obfuscation: `Rewrite this message to be more vague while maintaining the core message: "${message}"`,
      semantic_shifting: `Transform this message to use different phrasing and structure while preserving the intent: "${message}"`,
      noise_injection: `Add some confusion to this message while keeping it understandable to the intended recipient: "${message}"`
    };

    return prompts[strategy] || prompts.synonym_replacement;
  }

  // Generate unique key for message
  generateMessageKey(originalMessage, userKey) {
    const timestamp = Date.now().toString();
    const messageHash = crypto.createHash('sha256')
      .update(originalMessage + userKey + timestamp)
      .digest('hex');
    
    return messageHash.substring(0, 16);
  }

  // Fallback masking when AI is not available
  fallbackMasking(message, userKey) {
    const words = message.split(' ');
    const maskedWords = words.map(word => {
      if (word.length > 3) {
        return word.charAt(0) + '*'.repeat(word.length - 2) + word.charAt(word.length - 1);
      }
      return '*'.repeat(word.length);
    });

    return {
      maskedMessage: maskedWords.join(' '),
      messageKey: this.generateMessageKey(message, userKey),
      strategy: 'fallback',
      timestamp: new Date().toISOString()
    };
  }

  // Fallback unmasking
  fallbackUnmasking(maskedMessage, messageKey, userKey) {
    // Simple fallback - return the masked message as is
    // In a real implementation, you'd have a more sophisticated system
    return maskedMessage;
  }

  // Real-time message processing
  async processRealTimeMessage(message, userKey, options = {}) {
    try {
      const {
        maskingLevel = 'medium',
        enableAI = true,
        preserveFormatting = true
      } = options;

      if (!enableAI || !this.openai) {
        return this.fallbackMasking(message, userKey);
      }

      // Process message in real-time
      const masked = await this.maskMessage(message, userKey, maskingLevel);
      
      // Add real-time processing metadata
      masked.realTimeProcessed = true;
      masked.processingTime = Date.now();
      
      return masked;
    } catch (error) {
      console.error('Real-time message processing failed:', error);
      return this.fallbackMasking(message, userKey);
    }
  }

  // Analyze message for sensitive content
  async analyzeSensitivity(message) {
    try {
      if (!this.openai) {
        return { sensitive: false, confidence: 0 };
      }

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Analyze this message for sensitive information (personal data, financial info, etc.). Respond with JSON: {\"sensitive\": boolean, \"confidence\": number, \"categories\": [\"category1\", \"category2\"]}"
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.1
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      return analysis;
    } catch (error) {
      console.error('Failed to analyze message sensitivity:', error);
      return { sensitive: false, confidence: 0, categories: [] };
    }
  }

  // Generate conversation summary
  async generateConversationSummary(messages) {
    try {
      if (!this.openai) {
        return 'Conversation summary not available';
      }

      const messageTexts = messages.map(msg => `${msg.sender}: ${msg.content}`).join('\n');
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Summarize this conversation in 2-3 sentences, focusing on key topics and decisions."
          },
          {
            role: "user",
            content: messageTexts
          }
        ],
        max_tokens: 200,
        temperature: 0.3
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Failed to generate conversation summary:', error);
      return 'Unable to generate summary';
    }
  }
}

const aiService = new AIService();

// Initialize AI service
async function initializeAI() {
  await aiService.initialize();
}

module.exports = {
  aiService,
  initializeAI
};
