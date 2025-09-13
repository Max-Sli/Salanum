const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return this.type === 'group' || this.type === 'channel';
    }
  },
  description: String,
  type: {
    type: String,
    enum: ['private', 'group', 'channel'],
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    lastReadMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  avatar: String,
  settings: {
    isPublic: {
      type: Boolean,
      default: false
    },
    allowInvites: {
      type: Boolean,
      default: true
    },
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    allowVoiceMessages: {
      type: Boolean,
      default: true
    },
    allowVideoCalls: {
      type: Boolean,
      default: true
    },
    maxParticipants: {
      type: Number,
      default: 100
    },
    messageRetention: {
      type: Number,
      default: 30 // days
    }
  },
  encryption: {
    enabled: {
      type: Boolean,
      default: true
    },
    keyRotation: {
      type: Number,
      default: 7 // days
    },
    lastKeyRotation: Date
  },
  blockchain: {
    chatToken: String,
    transactionId: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  pinnedMessages: [{
    message: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message'
    },
    pinnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    pinnedAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  archived: {
    type: Boolean,
    default: false
  },
  archivedAt: Date
}, {
  timestamps: true
});

// Indexes for better performance
chatSchema.index({ participants: 1 });
chatSchema.index({ type: 1 });
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ 'blockchain.chatToken': 1 });

// Virtual for participant count
chatSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Method to add participant
chatSchema.methods.addParticipant = function(userId, role = 'member') {
  const existingParticipant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (!existingParticipant) {
    this.participants.push({ user: userId, role });
    this.lastActivity = new Date();
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to remove participant
chatSchema.methods.removeParticipant = function(userId) {
  this.participants = this.participants.filter(p => 
    p.user.toString() !== userId.toString()
  );
  this.lastActivity = new Date();
  return this.save();
};

// Method to update participant role
chatSchema.methods.updateParticipantRole = function(userId, newRole) {
  const participant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (participant) {
    participant.role = newRole;
    this.lastActivity = new Date();
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Method to check if user is participant
chatSchema.methods.isParticipant = function(userId) {
  return this.participants.some(p => p.user.toString() === userId.toString());
};

// Method to check if user has permission
chatSchema.methods.hasPermission = function(userId, permission) {
  const participant = this.participants.find(p => 
    p.user.toString() === userId.toString()
  );
  
  if (!participant) return false;
  
  const permissions = {
    member: ['read', 'send_message'],
    moderator: ['read', 'send_message', 'delete_message', 'pin_message'],
    admin: ['read', 'send_message', 'delete_message', 'pin_message', 'add_participant', 'remove_participant', 'change_settings']
  };
  
  return permissions[participant.role]?.includes(permission) || false;
};

// Method to pin message
chatSchema.methods.pinMessage = function(messageId, userId) {
  // Remove existing pin if exists
  this.pinnedMessages = this.pinnedMessages.filter(pin => 
    pin.message.toString() !== messageId.toString()
  );
  
  // Add new pin
  this.pinnedMessages.push({
    message: messageId,
    pinnedBy: userId
  });
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to unpin message
chatSchema.methods.unpinMessage = function(messageId) {
  this.pinnedMessages = this.pinnedMessages.filter(pin => 
    pin.message.toString() !== messageId.toString()
  );
  
  this.lastActivity = new Date();
  return this.save();
};

// Method to update last message
chatSchema.methods.updateLastMessage = function(messageId) {
  this.lastMessage = messageId;
  this.lastActivity = new Date();
  return this.save();
};

// Method to archive chat
chatSchema.methods.archiveChat = function() {
  this.archived = true;
  this.archivedAt = new Date();
  return this.save();
};

// Method to unarchive chat
chatSchema.methods.unarchiveChat = function() {
  this.archived = false;
  this.archivedAt = undefined;
  return this.save();
};

// Static method to find user chats
chatSchema.statics.findUserChats = function(userId, includeArchived = false) {
  const query = {
    participants: { $elemMatch: { user: userId } },
    isActive: true
  };
  
  if (!includeArchived) {
    query.archived = false;
  }
  
  return this.find(query)
    .populate('participants.user', 'username profile.avatar profile.status')
    .populate('lastMessage', 'content createdAt sender')
    .populate('createdBy', 'username')
    .sort({ lastActivity: -1 });
};

// Static method to create private chat
chatSchema.statics.createPrivateChat = function(user1Id, user2Id) {
  // Check if private chat already exists
  return this.findOne({
    type: 'private',
    participants: {
      $all: [
        { $elemMatch: { user: user1Id } },
        { $elemMatch: { user: user2Id } }
      ]
    }
  }).then(existingChat => {
    if (existingChat) {
      return existingChat;
    }
    
    // Create new private chat
    return this.create({
      type: 'private',
      participants: [
        { user: user1Id, role: 'member' },
        { user: user2Id, role: 'member' }
      ],
      createdBy: user1Id
    });
  });
};

// Static method to create group chat
chatSchema.statics.createGroupChat = function(name, createdBy, participants = []) {
  const allParticipants = [
    { user: createdBy, role: 'admin' },
    ...participants.map(userId => ({ user: userId, role: 'member' }))
  ];
  
  return this.create({
    name,
    type: 'group',
    participants: allParticipants,
    createdBy
  });
};

// Static method to create channel
chatSchema.statics.createChannel = function(name, description, createdBy, isPublic = false) {
  return this.create({
    name,
    description,
    type: 'channel',
    participants: [{ user: createdBy, role: 'admin' }],
    createdBy,
    settings: {
      isPublic,
      allowInvites: true
    }
  });
};

module.exports = mongoose.model('Chat', chatSchema);
