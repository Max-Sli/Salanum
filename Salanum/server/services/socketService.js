const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { encryptionService } = require('./encryptionService');
const { aiService } = require('./aiService');

// Store active connections
const activeConnections = new Map();

function setupSocketHandlers(io) {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);
    
    // Store connection
    activeConnections.set(socket.userId, socket);
    
    // Update user status to online
    updateUserStatus(socket.userId, 'online');

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);

    // Join user to all their chat rooms
    joinUserToChats(socket);

    // Handle sending messages
    socket.on('send_message', async (data) => {
      try {
        await handleSendMessage(socket, data);
      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('message_error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
      handleTypingStart(socket, data);
    });

    socket.on('typing_stop', (data) => {
      handleTypingStop(socket, data);
    });

    // Handle message read receipts
    socket.on('message_read', async (data) => {
      try {
        await handleMessageRead(socket, data);
      } catch (error) {
        console.error('Message read error:', error);
      }
    });

    // Handle joining chat
    socket.on('join_chat', (data) => {
      handleJoinChat(socket, data);
    });

    // Handle leaving chat
    socket.on('leave_chat', (data) => {
      handleLeaveChat(socket, data);
    });

    // Handle voice call
    socket.on('voice_call_start', (data) => {
      handleVoiceCallStart(socket, data);
    });

    socket.on('voice_call_end', (data) => {
      handleVoiceCallEnd(socket, data);
    });

    // Handle video call
    socket.on('video_call_start', (data) => {
      handleVideoCallStart(socket, data);
    });

    socket.on('video_call_end', (data) => {
      handleVideoCallEnd(socket, data);
    });

    // Handle real-time AI processing
    socket.on('ai_process_message', async (data) => {
      try {
        await handleAIProcessMessage(socket, data);
      } catch (error) {
        console.error('AI process message error:', error);
        socket.emit('ai_process_error', { error: 'Failed to process message' });
      }
    });

    // Handle blockchain transactions
    socket.on('blockchain_transaction', async (data) => {
      try {
        await handleBlockchainTransaction(socket, data);
      } catch (error) {
        console.error('Blockchain transaction error:', error);
        socket.emit('blockchain_error', { error: 'Transaction failed' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      
      // Remove connection
      activeConnections.delete(socket.userId);
      
      // Update user status to offline
      updateUserStatus(socket.userId, 'offline');
    });
  });
}

// Join user to all their chat rooms
async function joinUserToChats(socket) {
  try {
    const user = await User.findById(socket.userId);
    const chats = await Chat.find({
      participants: { $elemMatch: { user: socket.userId } }
    });

    chats.forEach(chat => {
      socket.join(`chat_${chat._id}`);
    });
  } catch (error) {
    console.error('Error joining user to chats:', error);
  }
}

// Handle sending messages
async function handleSendMessage(socket, data) {
  const { chatId, content, messageType = 'text', replyTo } = data;

  if (!content) {
    socket.emit('message_error', { error: 'Message content is required' });
    return;
  }

  // Get chat and verify user is participant
  const chat = await Chat.findById(chatId);
  if (!chat || !chat.isParticipant(socket.userId)) {
    socket.emit('message_error', { error: 'Not authorized to send messages to this chat' });
    return;
  }

  // Encrypt message content
  const encryptedContent = encryptionService.encryptMessage(content, socket.user.encryption.userKey);

  // AI masking for privacy
  const aiMasking = await aiService.maskMessage(
    content, 
    socket.user.encryption.userKey, 
    socket.user.preferences.privacy.aiMaskingLevel
  );

  // Generate message hash for blockchain
  const messageHash = encryptionService.generateMessageHash(
    content, 
    Date.now().toString(), 
    socket.userId
  );

  // Create message
  const message = new Message({
    sender: socket.userId,
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
      unmaskingKey: socket.user.encryption.userKey
    },
    blockchain: {
      hash: messageHash,
      verified: true
    },
    replyTo
  });

  await message.save();

  // Update chat's last message
  await chat.updateLastMessage(message._id);

  // Populate message for broadcasting
  await message.populate('sender', 'username profile.avatar');

  // Broadcast message to all participants in the chat
  socket.to(`chat_${chatId}`).emit('new_message', {
    message: message.getDisplayMessage(socket.userId),
    chatId
  });

  // Send confirmation to sender
  socket.emit('message_sent', {
    message: message.getDisplayMessage(socket.userId),
    chatId
  });
}

// Handle typing indicators
function handleTypingStart(socket, data) {
  const { chatId } = data;
  socket.to(`chat_${chatId}`).emit('user_typing', {
    userId: socket.userId,
    username: socket.user.username,
    chatId
  });
}

function handleTypingStop(socket, data) {
  const { chatId } = data;
  socket.to(`chat_${chatId}`).emit('user_stopped_typing', {
    userId: socket.userId,
    chatId
  });
}

// Handle message read receipts
async function handleMessageRead(socket, data) {
  const { messageId } = data;

  const message = await Message.findById(messageId);
  if (message) {
    await message.markAsRead(socket.userId);
    
    // Notify sender that message was read
    socket.to(`user_${message.sender}`).emit('message_read', {
      messageId,
      readBy: socket.userId,
      readAt: new Date()
    });
  }
}

// Handle joining chat
function handleJoinChat(socket, data) {
  const { chatId } = data;
  socket.join(`chat_${chatId}`);
  
  // Notify other participants
  socket.to(`chat_${chatId}`).emit('user_joined_chat', {
    userId: socket.userId,
    username: socket.user.username,
    chatId
  });
}

// Handle leaving chat
function handleLeaveChat(socket, data) {
  const { chatId } = data;
  socket.leave(`chat_${chatId}`);
  
  // Notify other participants
  socket.to(`chat_${chatId}`).emit('user_left_chat', {
    userId: socket.userId,
    username: socket.user.username,
    chatId
  });
}

// Handle voice call
function handleVoiceCallStart(socket, data) {
  const { chatId, callId } = data;
  
  socket.to(`chat_${chatId}`).emit('voice_call_started', {
    callId,
    callerId: socket.userId,
    callerName: socket.user.username,
    chatId
  });
}

function handleVoiceCallEnd(socket, data) {
  const { chatId, callId } = data;
  
  socket.to(`chat_${chatId}`).emit('voice_call_ended', {
    callId,
    chatId
  });
}

// Handle video call
function handleVideoCallStart(socket, data) {
  const { chatId, callId } = data;
  
  socket.to(`chat_${chatId}`).emit('video_call_started', {
    callId,
    callerId: socket.userId,
    callerName: socket.user.username,
    chatId
  });
}

function handleVideoCallEnd(socket, data) {
  const { chatId, callId } = data;
  
  socket.to(`chat_${chatId}`).emit('video_call_ended', {
    callId,
    chatId
  });
}

// Handle real-time AI processing
async function handleAIProcessMessage(socket, data) {
  const { message, options = {} } = data;

  if (!message) {
    socket.emit('ai_process_error', { error: 'Message is required' });
    return;
  }

  // Process message in real-time
  const processedMessage = await aiService.processRealTimeMessage(
    message, 
    socket.user.encryption.userKey, 
    options
  );

  socket.emit('ai_message_processed', {
    originalMessage: message,
    processedMessage,
    options
  });
}

// Handle blockchain transactions
async function handleBlockchainTransaction(socket, data) {
  const { type, amount, toAddress } = data;

  // This would integrate with the blockchain service
  // For now, we'll just emit a confirmation
  socket.emit('blockchain_transaction_confirmed', {
    type,
    amount,
    toAddress,
    timestamp: new Date()
  });
}

// Update user status
async function updateUserStatus(userId, status) {
  try {
    const user = await User.findById(userId);
    if (user) {
      await user.updateStatus(status);
      
      // Notify contacts about status change
      const userSocket = activeConnections.get(userId);
      if (userSocket) {
        userSocket.to(`user_${userId}`).emit('user_status_changed', {
          userId,
          status,
          lastSeen: user.profile.lastSeen
        });
      }
    }
  } catch (error) {
    console.error('Error updating user status:', error);
  }
}

// Send notification to user
function sendNotificationToUser(userId, notification) {
  const userSocket = activeConnections.get(userId);
  if (userSocket) {
    userSocket.emit('notification', notification);
  }
}

// Broadcast to chat
function broadcastToChat(chatId, event, data) {
  const io = require('../index').io;
  io.to(`chat_${chatId}`).emit(event, data);
}

module.exports = {
  setupSocketHandlers,
  activeConnections,
  sendNotificationToUser,
  broadcastToChat
};
