const express = require('express');
const User = require('../models/User');
const Chat = require('../models/Chat');

const router = express.Router();

// Search users
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    const users = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        { isActive: true },
        {
          $or: [
            { username: { $regex: q, $options: 'i' } },
            { 'profile.firstName': { $regex: q, $options: 'i' } },
            { 'profile.lastName': { $regex: q, $options: 'i' } }
          ]
        }
      ]
    })
    .select('username profile.firstName profile.lastName profile.avatar profile.status isVerified')
    .limit(parseInt(limit));

    res.json({
      users: users.map(user => user.getPublicProfile()),
      query: q
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by ID
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add user to contacts
router.post('/:userId/contact', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { nickname } = req.body;

    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself to contacts' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    await currentUser.addContact(userId, nickname);

    res.json({ message: 'Contact added successfully' });

  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove user from contacts
router.delete('/:userId/contact', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    await currentUser.removeContact(userId);

    res.json({ message: 'Contact removed successfully' });

  } catch (error) {
    console.error('Remove contact error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Block user
router.post('/:userId/block', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot block yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    await currentUser.blockUser(userId);

    res.json({ message: 'User blocked successfully' });

  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unblock user
router.delete('/:userId/block', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    await currentUser.unblockUser(userId);

    res.json({ message: 'User unblocked successfully' });

  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's contacts
router.get('/contacts/list', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('contacts.user', 'username profile.avatar profile.status');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const contacts = user.contacts.map(contact => ({
      ...contact.user.getPublicProfile(),
      nickname: contact.nickname,
      addedAt: contact.addedAt
    }));

    res.json({ contacts });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get blocked users
router.get('/blocked/list', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('blockedUsers', 'username profile.avatar');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const blockedUsers = user.blockedUsers.map(blockedUser => 
      blockedUser.getPublicProfile()
    );

    res.json({ blockedUsers });

  } catch (error) {
    console.error('Get blocked users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start private chat with user
router.post('/:userId/chat', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.userId.toString()) {
      return res.status(400).json({ message: 'Cannot start chat with yourself' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentUser = await User.findById(req.userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    // Check if user is blocked
    if (currentUser.isBlocked(userId)) {
      return res.status(403).json({ message: 'Cannot start chat with blocked user' });
    }

    // Create or get existing private chat
    const chat = await Chat.createPrivateChat(req.userId, userId);

    res.json({
      message: 'Chat created successfully',
      chat: {
        _id: chat._id,
        type: chat.type,
        participants: chat.participants,
        lastActivity: chat.lastActivity
      }
    });

  } catch (error) {
    console.error('Start chat error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get online users
router.get('/online/list', authenticateToken, async (req, res) => {
  try {
    const onlineUsers = await User.findOnlineUsers()
      .select('username profile.avatar profile.status profile.lastSeen')
      .limit(50);

    const users = onlineUsers
      .filter(user => user._id.toString() !== req.userId.toString())
      .map(user => user.getPublicProfile());

    res.json({ onlineUsers: users });

  } catch (error) {
    console.error('Get online users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status
router.put('/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['online', 'offline', 'away', 'busy'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.updateStatus(status);

    res.json({ 
      message: 'Status updated successfully',
      status: user.profile.status
    });

  } catch (error) {
    console.error('Update status error:', error);
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
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    
    req.userId = decoded.userId;
    next();
  });
}

module.exports = router;
