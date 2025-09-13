const express = require('express');
const { aiService } = require('../services/aiService');

const router = express.Router();

// Mask message using AI
router.post('/mask-message', authenticateToken, async (req, res) => {
  try {
    const { message, maskingLevel = 'medium' } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mask the message
    const maskedResult = await aiService.maskMessage(
      message, 
      user.encryption.userKey, 
      maskingLevel
    );

    res.json({
      originalMessage: message,
      maskedMessage: maskedResult.maskedMessage,
      strategy: maskedResult.strategy,
      messageKey: maskedResult.messageKey,
      timestamp: maskedResult.timestamp
    });

  } catch (error) {
    console.error('Mask message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unmask message using AI
router.post('/unmask-message', authenticateToken, async (req, res) => {
  try {
    const { maskedMessage, messageKey } = req.body;

    if (!maskedMessage || !messageKey) {
      return res.status(400).json({ message: 'Masked message and message key are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Unmask the message
    const unmaskedMessage = await aiService.unmaskMessage(
      maskedMessage, 
      messageKey, 
      user.encryption.userKey
    );

    res.json({
      maskedMessage,
      unmaskedMessage,
      messageKey
    });

  } catch (error) {
    console.error('Unmask message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analyze message sensitivity
router.post('/analyze-sensitivity', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Analyze message for sensitive content
    const analysis = await aiService.analyzeSensitivity(message);

    res.json({
      message,
      analysis
    });

  } catch (error) {
    console.error('Analyze sensitivity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate conversation summary
router.post('/conversation-summary', authenticateToken, async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    // Generate conversation summary
    const summary = await aiService.generateConversationSummary(messages);

    res.json({
      summary,
      messageCount: messages.length
    });

  } catch (error) {
    console.error('Generate conversation summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process real-time message
router.post('/process-realtime', authenticateToken, async (req, res) => {
  try {
    const { message, options = {} } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Process message in real-time
    const processedMessage = await aiService.processRealTimeMessage(
      message, 
      user.encryption.userKey, 
      options
    );

    res.json({
      originalMessage: message,
      processedMessage,
      options
    });

  } catch (error) {
    console.error('Process real-time message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI service status
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const isAvailable = aiService.openai !== null;
    
    res.json({
      available: isAvailable,
      strategies: aiService.maskingStrategies,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Get AI status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test AI connection
router.post('/test-connection', authenticateToken, async (req, res) => {
  try {
    await aiService.testConnection();
    
    res.json({
      message: 'AI connection test successful',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test AI connection error:', error);
    res.status(500).json({ 
      message: 'AI connection test failed',
      error: error.message
    });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.userId = decoded.userId;
    next();
  });
}

module.exports = router;
