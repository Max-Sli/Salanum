const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat'
  },
  content: {
    type: String,
    required: true,
    maxlength: 4000
  },
  originalContent: {
    type: String,
    required: true
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file', 'audio', 'video', 'location', 'contact', 'sticker'],
    default: 'text'
  },
  encryption: {
    encrypted: {
      type: Boolean,
      default: true
    },
    encryptionKey: String,
    algorithm: String,
    iv: String,
    tag: String
  },
  aiMasking: {
    masked: {
      type: Boolean,
      default: false
    },
    maskedContent: String,
    maskingStrategy: String,
    messageKey: String,
    unmaskingKey: String
  },
  blockchain: {
    hash: String,
    signature: String,
    transactionId: String,
    blockNumber: Number,
    verified: {
      type: Boolean,
      default: false
    }
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String,
    thumbnail: String,
    encrypted: {
      type: Boolean,
      default: true
    }
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  forwarded: {
    type: Boolean,
    default: false
  },
  forwardedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  reactions: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    emoji: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  edited: {
    type: Boolean,
    default: false
  },
  editedAt: Date,
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date,
  deleteForEveryone: {
    type: Boolean,
    default: false
  },
  metadata: {
    clientVersion: String,
    platform: String,
    location: {
      latitude: Number,
      longitude: Number,
      accuracy: Number
    },
    deviceInfo: {
      userAgent: String,
      screenResolution: String,
      timezone: String
    }
  }
}, {
  timestamps: true
});

// Indexes for better performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, createdAt: -1 });
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ 'blockchain.hash': 1 });
messageSchema.index({ status: 1 });
messageSchema.index({ deleted: 1 });

// Virtual for message age
messageSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Method to mark as read
messageSchema.methods.markAsRead = function(userId) {
  const existingRead = this.readBy.find(read => 
    read.user.toString() === userId.toString()
  );
  
  if (!existingRead) {
    this.readBy.push({ user: userId });
    this.status = 'read';
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to add reaction
messageSchema.methods.addReaction = function(userId, emoji) {
  // Remove existing reaction from this user
  this.reactions = this.reactions.filter(reaction => 
    reaction.user.toString() !== userId.toString()
  );
  
  // Add new reaction
  this.reactions.push({ user: userId, emoji });
  return this.save();
};

// Method to remove reaction
messageSchema.methods.removeReaction = function(userId) {
  this.reactions = this.reactions.filter(reaction => 
    reaction.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to edit message
messageSchema.methods.editMessage = function(newContent) {
  // Save current content to history
  this.editHistory.push({
    content: this.content,
    editedAt: new Date()
  });
  
  // Update content
  this.content = newContent;
  this.edited = true;
  this.editedAt = new Date();
  
  return this.save();
};

// Method to delete message
messageSchema.methods.deleteMessage = function(deleteForEveryone = false) {
  this.deleted = true;
  this.deletedAt = new Date();
  this.deleteForEveryone = deleteForEveryone;
  
  if (deleteForEveryone) {
    this.content = 'This message was deleted';
    this.originalContent = 'This message was deleted';
  }
  
  return this.save();
};

// Method to get message for display
messageSchema.methods.getDisplayMessage = function(userId) {
  if (this.deleted && !this.deleteForEveryone) {
    return null; // Don't show deleted messages to other users
  }
  
  return {
    _id: this._id,
    sender: this.sender,
    content: this.content,
    messageType: this.messageType,
    createdAt: this.createdAt,
    edited: this.edited,
    editedAt: this.editedAt,
    status: this.status,
    readBy: this.readBy,
    reactions: this.reactions,
    replyTo: this.replyTo,
    forwarded: this.forwarded,
    attachments: this.attachments
  };
};

// Static method to get messages for chat
messageSchema.statics.getChatMessages = function(chatId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  return this.find({ 
    chat: chatId, 
    deleted: false 
  })
  .populate('sender', 'username profile.avatar')
  .populate('replyTo', 'content sender')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);
};

// Static method to search messages
messageSchema.statics.searchMessages = function(query, userId, chatId = null) {
  const searchQuery = {
    $or: [
      { content: { $regex: query, $options: 'i' } },
      { originalContent: { $regex: query, $options: 'i' } }
    ],
    deleted: false
  };
  
  if (chatId) {
    searchQuery.chat = chatId;
  } else {
    searchQuery.$or.push(
      { sender: userId },
      { recipient: userId }
    );
  }
  
  return this.find(searchQuery)
    .populate('sender', 'username profile.avatar')
    .populate('chat', 'name type')
    .sort({ createdAt: -1 })
    .limit(100);
};

module.exports = mongoose.model('Message', messageSchema);
