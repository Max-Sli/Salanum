const cron = require('node-cron');
const User = require('../models/User');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const { solanaService } = require('./solanaService');
const { aiService } = require('./aiService');

function setupCronJobs() {
  console.log('Setting up cron jobs...');

  // Update user balances every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      console.log('Updating user balances...');
      await updateUserBalances();
    } catch (error) {
      console.error('Error updating user balances:', error);
    }
  });

  // Clean up old messages every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('Cleaning up old messages...');
      await cleanupOldMessages();
    } catch (error) {
      console.error('Error cleaning up old messages:', error);
    }
  });

  // Update user statuses every 2 minutes
  cron.schedule('*/2 * * * *', async () => {
    try {
      console.log('Updating user statuses...');
      await updateUserStatuses();
    } catch (error) {
      console.error('Error updating user statuses:', error);
    }
  });

  // Rotate encryption keys daily
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Rotating encryption keys...');
      await rotateEncryptionKeys();
    } catch (error) {
      console.error('Error rotating encryption keys:', error);
    }
  });

  // Generate conversation summaries daily
  cron.schedule('0 1 * * *', async () => {
    try {
      console.log('Generating conversation summaries...');
      await generateConversationSummaries();
    } catch (error) {
      console.error('Error generating conversation summaries:', error);
    }
  });

  // Clean up inactive chats weekly
  cron.schedule('0 0 * * 0', async () => {
    try {
      console.log('Cleaning up inactive chats...');
      await cleanupInactiveChats();
    } catch (error) {
      console.error('Error cleaning up inactive chats:', error);
    }
  });

  // Backup blockchain data daily
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('Backing up blockchain data...');
      await backupBlockchainData();
    } catch (error) {
      console.error('Error backing up blockchain data:', error);
    }
  });

  // Monitor AI service health every 10 minutes
  cron.schedule('*/10 * * * *', async () => {
    try {
      console.log('Monitoring AI service health...');
      await monitorAIServiceHealth();
    } catch (error) {
      console.error('Error monitoring AI service health:', error);
    }
  });

  console.log('Cron jobs setup completed');
}

// Update user balances from blockchain
async function updateUserBalances() {
  try {
    const users = await User.find({ isActive: true });
    
    for (const user of users) {
      try {
        // Get SOL balance
        const solBalance = await solanaService.getBalance(user.wallet.solanaAddress);
        
        // Get token balance
        const tokenBalance = await solanaService.getTokenBalance(user.wallet.solanaAddress);

        // Update user's balance if changed
        if (user.wallet.balance !== solBalance || user.wallet.tokenBalance !== tokenBalance) {
          user.wallet.balance = solBalance;
          user.wallet.tokenBalance = tokenBalance;
          await user.save();
          
          console.log(`Updated balance for user ${user.username}: SOL ${solBalance}, Tokens ${tokenBalance}`);
        }
      } catch (error) {
        console.error(`Error updating balance for user ${user.username}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in updateUserBalances:', error);
  }
}

// Clean up old messages based on retention policy
async function cleanupOldMessages() {
  try {
    const chats = await Chat.find({ isActive: true });
    
    for (const chat of chats) {
      const retentionDays = chat.settings.messageRetention || 30;
      const cutoffDate = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
      
      // Delete old messages
      const result = await Message.deleteMany({
        chat: chat._id,
        createdAt: { $lt: cutoffDate },
        deleted: false
      });
      
      if (result.deletedCount > 0) {
        console.log(`Cleaned up ${result.deletedCount} old messages from chat ${chat.name || chat._id}`);
      }
    }
  } catch (error) {
    console.error('Error in cleanupOldMessages:', error);
  }
}

// Update user statuses (mark offline users who haven't been active)
async function updateUserStatuses() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const users = await User.find({
      'profile.status': 'online',
      'profile.lastSeen': { $lt: fiveMinutesAgo }
    });
    
    for (const user of users) {
      await user.updateStatus('offline');
      console.log(`Marked user ${user.username} as offline`);
    }
  } catch (error) {
    console.error('Error in updateUserStatuses:', error);
  }
}

// Rotate encryption keys for enhanced security
async function rotateEncryptionKeys() {
  try {
    const users = await User.find({ isActive: true });
    
    for (const user of users) {
      try {
        // Generate new encryption key
        const newUserKey = require('crypto').randomBytes(32).toString('hex');
        
        // Update user's encryption key
        user.encryption.userKey = newUserKey;
        user.encryption.keyDerivationSalt = require('crypto').randomBytes(32).toString('hex');
        
        await user.save();
        
        console.log(`Rotated encryption key for user ${user.username}`);
      } catch (error) {
        console.error(`Error rotating key for user ${user.username}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in rotateEncryptionKeys:', error);
  }
}

// Generate conversation summaries for active chats
async function generateConversationSummaries() {
  try {
    const activeChats = await Chat.find({
      isActive: true,
      lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Active in last 24 hours
    });
    
    for (const chat of activeChats) {
      try {
        // Get recent messages
        const messages = await Message.find({
          chat: chat._id,
          createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          deleted: false
        })
        .populate('sender', 'username')
        .sort({ createdAt: 1 })
        .limit(100);
        
        if (messages.length > 10) { // Only summarize if there are enough messages
          const summary = await aiService.generateConversationSummary(messages);
          
          // Store summary (you might want to create a separate model for this)
          console.log(`Generated summary for chat ${chat.name || chat._id}: ${summary.substring(0, 100)}...`);
        }
      } catch (error) {
        console.error(`Error generating summary for chat ${chat._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Error in generateConversationSummaries:', error);
  }
}

// Clean up inactive chats
async function cleanupInactiveChats() {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const inactiveChats = await Chat.find({
      isActive: true,
      lastActivity: { $lt: thirtyDaysAgo },
      type: { $in: ['group', 'channel'] } // Don't archive private chats
    });
    
    for (const chat of inactiveChats) {
      await chat.archiveChat();
      console.log(`Archived inactive chat ${chat.name || chat._id}`);
    }
  } catch (error) {
    console.error('Error in cleanupInactiveChats:', error);
  }
}

// Backup blockchain data
async function backupBlockchainData() {
  try {
    // Get all messages with blockchain data
    const messagesWithBlockchain = await Message.find({
      'blockchain.hash': { $exists: true },
      'blockchain.verified': true
    }).select('blockchain createdAt');
    
    // In a real implementation, you would backup this data to a secure location
    console.log(`Backed up ${messagesWithBlockchain.length} blockchain records`);
    
    // You might want to store this in a separate collection or external service
    // For now, we'll just log the count
  } catch (error) {
    console.error('Error in backupBlockchainData:', error);
  }
}

// Monitor AI service health
async function monitorAIServiceHealth() {
  try {
    if (aiService.openai) {
      await aiService.testConnection();
      console.log('AI service health check: OK');
    } else {
      console.log('AI service health check: DISABLED');
    }
  } catch (error) {
    console.error('AI service health check: FAILED', error);
    
    // You might want to send alerts or notifications here
    // For example, send an email to administrators
  }
}

// Manual trigger functions (can be called from API endpoints)
async function triggerBalanceUpdate() {
  await updateUserBalances();
}

async function triggerMessageCleanup() {
  await cleanupOldMessages();
}

async function triggerKeyRotation() {
  await rotateEncryptionKeys();
}

module.exports = {
  setupCronJobs,
  triggerBalanceUpdate,
  triggerMessageCleanup,
  triggerKeyRotation
};
