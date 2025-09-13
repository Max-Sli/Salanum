const express = require('express');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');
const { encryptionService } = require('../services/encryptionService');
const { aiService } = require('../services/aiService');
const { solanaService } = require('../services/solanaService');

const router = express.Router();

// Send message
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { chatId, content, messageType = 'text', replyTo, attachments = [] } = req.body;

    if (!content && attachments.length === 0) {
      return res.status(400).json({ message: 'Message content or attachments required' });
    }

    // Get sender user
    const sender = await User.findById(req.userId);
    if (!sender) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    if (!chat.isParticipant(req.userId)) {
      return res.status(403).json({ message: 'Not authorized to send messages to this chat' });
    }

    // Encrypt message content
    const encryptedContent = encryptionService.encryptMessage(content, sender.encryption.userKey);

    // AI masking for privacy
    const aiMasking = await aiService.maskMessage(
      content, 
      sender.encryption.userKey, 
      sender.preferences.privacy.aiMaskingLevel
    );

    // Generate message hash for blockchain
    const messageHash = encryptionService.generateMessageHash(
      content, 
      Date.now().toString(), 
      req.userId.toString()
    );

    // Store hash on blockchain
    const blockchainSignature = await solanaService.storeMessageHash(
      messageHash, 
      sender.wallet.solanaAddress
    );

    // Create message
    const message = new Message({
      sender: req.userId,
      chat: chatId,
      content: aiMasking.maskedMessage,
      originalContent: content,
      messageType,
      encryption: {
        encrypted: true,
        encryptionKey: encryptedContent.iv,
        algorithm: encryptedContent.algorithm,
        iv: encryptedContent.iv,
        tag: encryptedContent.tag
      },
      aiMasking: {
        masked: true,
        maskedContent: aiMasking.maskedMessage,
        maskingStrategy: aiMasking.strategy,
        messageKey: aiMasking.messageKey,
        unmaskingKey: sender.encryption.userKey
      },
      blockchain: {
        hash: messageHash,
        signature: blockchainSignature,
        verified: true
      },
      attachments,
      replyTo
    });

    await message.save();

    // Update chat's last message
    await chat.updateLastMessage(message._id);

    // Populate message for response
    await message.populate('sender', 'username profile.avatar');

    res.status(201).json({
      message: 'Message sent successfully',
      data: message.getDisplayMessage(req.userId)
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for chat
router.get('/chat/:chatId', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    // Check if user is participant
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (!chat.isParticipant(req.userId)) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    // Get messages
    const messages = await Message.getChatMessages(chatId, parseInt(page), parseInt(limit));

    // Decrypt and unmask messages for the user
    const decryptedMessages = await Promise.all(
      messages.map(async (msg) => {
        try {
          // Decrypt original content
          const decryptedContent = encryptionService.decryptMessage(
            {
              encrypted: msg.originalContent,
              iv: msg.encryption.iv,
              tag: msg.encryption.tag,
              algorithm: msg.encryption.algorithm
            },
            req.user.encryption.userKey
          );

          // Unmask content using AI
          const unmaskedContent = await aiService.unmaskMessage(
            msg.content,
            msg.aiMasking.messageKey,
            req.user.encryption.userKey
          );

          return {
            ...msg.getDisplayMessage(req.userId),
            content: unmaskedContent,
            originalContent: decryptedContent
          };
        } catch (error) {
          console.error('Message decryption error:', error);
          return msg.getDisplayMessage(req.userId);
        }
      })
    );

    res.json({
      messages: decryptedMessages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        hasMore: messages.length === parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is participant in the chat
    const chat = await Chat.findById(message.chat);
    if (!chat || !chat.isParticipant(req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.markAsRead(req.userId);

    res.json({ message: 'Message marked as read' });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add reaction to message
router.post('/:messageId/reaction', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    if (!emoji) {
      return res.status(400).json({ message: 'Emoji is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is participant in the chat
    const chat = await Chat.findById(message.chat);
    if (!chat || !chat.isParticipant(req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.addReaction(req.userId, emoji);

    res.json({ message: 'Reaction added successfully' });

  } catch (error) {
    console.error('Add reaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove reaction from message
router.delete('/:messageId/reaction', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is participant in the chat
    const chat = await Chat.findById(message.chat);
    if (!chat || !chat.isParticipant(req.userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await message.removeReaction(req.userId);

    res.json({ message: 'Reaction removed successfully' });

  } catch (error) {
    console.error('Remove reaction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit message
router.put('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this message' });
    }

    // Check if message is too old to edit (e.g., 15 minutes)
    const editTimeLimit = 15 * 60 * 1000; // 15 minutes
    if (Date.now() - message.createdAt.getTime() > editTimeLimit) {
      return res.status(400).json({ message: 'Message is too old to edit' });
    }

    // Encrypt new content
    const user = await User.findById(req.userId);
    const encryptedContent = encryptionService.encryptMessage(content, user.encryption.userKey);

    // AI masking for new content
    const aiMasking = await aiService.maskMessage(
      content, 
      user.encryption.userKey, 
      user.preferences.privacy.aiMaskingLevel
    );

    // Update message
    message.content = aiMasking.maskedMessage;
    message.originalContent = content;
    message.encryption.iv = encryptedContent.iv;
    message.encryption.tag = encryptedContent.tag;
    message.aiMasking.maskedContent = aiMasking.maskedMessage;
    message.aiMasking.maskingStrategy = aiMasking.strategy;
    message.aiMasking.messageKey = aiMasking.messageKey;

    await message.editMessage(aiMasking.maskedMessage);

    res.json({ message: 'Message edited successfully' });

  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete message
router.delete('/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const { deleteForEveryone = false } = req.body;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user is the sender or has admin permissions
    const chat = await Chat.findById(message.chat);
    const isSender = message.sender.toString() === req.userId.toString();
    const hasAdminPermission = chat && chat.hasPermission(req.userId, 'delete_message');

    if (!isSender && !hasAdminPermission) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteMessage(deleteForEveryone);

    res.json({ message: 'Message deleted successfully' });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search messages
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, chatId } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const messages = await Message.searchMessages(q, req.userId, chatId);

    res.json({
      messages: messages.map(msg => msg.getDisplayMessage(req.userId)),
      query: q
    });

  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({ message: 'Server error' });
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
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.userId = decoded.userId;
    
    // Get user for decryption keys
    try {
      req.user = await User.findById(req.userId);
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
    
    next();
  });
}

module.exports = router;
