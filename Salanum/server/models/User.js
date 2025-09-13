const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  salt: {
    type: String,
    required: true
  },
  profile: {
    firstName: String,
    lastName: String,
    bio: String,
    avatar: String,
    status: {
      type: String,
      enum: ['online', 'offline', 'away', 'busy'],
      default: 'offline'
    },
    lastSeen: {
      type: Date,
      default: Date.now
    }
  },
  wallet: {
    solanaAddress: {
      type: String,
      required: true
    },
    solanaPrivateKey: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      default: 0
    },
    tokenBalance: {
      type: Number,
      default: 0
    }
  },
  encryption: {
    userKey: {
      type: String,
      required: true
    },
    publicKey: String,
    privateKey: String,
    keyDerivationSalt: String
  },
  security: {
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: String,
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockUntil: Date,
    lastLogin: Date,
    ipAddresses: [String]
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      messages: {
        type: Boolean,
        default: true
      },
      calls: {
        type: Boolean,
        default: true
      },
      blockchain: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      showOnlineStatus: {
        type: Boolean,
        default: true
      },
      allowReadReceipts: {
        type: Boolean,
        default: true
      },
      aiMaskingLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'maximum'],
        default: 'medium'
      }
    }
  },
  contacts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    nickname: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ 'wallet.solanaAddress': 1 });
userSchema.index({ 'profile.status': 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.security.lockUntil && this.security.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password + this.salt, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword + this.salt, this.password);
};

// Method to get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  return {
    _id: this._id,
    username: this.username,
    profile: {
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      bio: this.profile.bio,
      avatar: this.profile.avatar,
      status: this.profile.status,
      lastSeen: this.profile.lastSeen
    },
    wallet: {
      solanaAddress: this.wallet.solanaAddress
    },
    isVerified: this.isVerified,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
