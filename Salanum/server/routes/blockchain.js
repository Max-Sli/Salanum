const express = require('express');
const User = require('../models/User');
const { solanaService } = require('../services/solanaService');

const router = express.Router();

// Get wallet balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get SOL balance
    const solBalance = await solanaService.getBalance(user.wallet.solanaAddress);
    
    // Get token balance
    const tokenBalance = await solanaService.getTokenBalance(user.wallet.solanaAddress);

    // Update user's balance in database
    user.wallet.balance = solBalance;
    user.wallet.tokenBalance = tokenBalance;
    await user.save();

    res.json({
      solBalance,
      tokenBalance,
      address: user.wallet.solanaAddress
    });

  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send SOL transaction
router.post('/send-sol', authenticateToken, async (req, res) => {
  try {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount) {
      return res.status(400).json({ message: 'Recipient address and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has sufficient balance
    const currentBalance = await solanaService.getBalance(user.wallet.solanaAddress);
    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Parse private key
    const privateKey = JSON.parse(user.wallet.solanaPrivateKey);

    // Send SOL
    const signature = await solanaService.sendSOL(privateKey, toAddress, amount);

    res.json({
      message: 'SOL sent successfully',
      signature,
      amount,
      toAddress
    });

  } catch (error) {
    console.error('Send SOL error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send messenger tokens
router.post('/send-tokens', authenticateToken, async (req, res) => {
  try {
    const { toAddress, amount } = req.body;

    if (!toAddress || !amount) {
      return res.status(400).json({ message: 'Recipient address and amount are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be positive' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has sufficient token balance
    const currentTokenBalance = await solanaService.getTokenBalance(user.wallet.solanaAddress);
    if (currentTokenBalance < amount) {
      return res.status(400).json({ message: 'Insufficient token balance' });
    }

    // Parse private key
    const privateKey = JSON.parse(user.wallet.solanaPrivateKey);

    // Send tokens
    const signature = await solanaService.sendTokens(privateKey, toAddress, amount);

    res.json({
      message: 'Tokens sent successfully',
      signature,
      amount,
      toAddress
    });

  } catch (error) {
    console.error('Send tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mint tokens (for rewards, etc.)
router.post('/mint-tokens', authenticateToken, async (req, res) => {
  try {
    const { amount, reason } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Mint tokens to user
    const signature = await solanaService.mintTokens(user.wallet.solanaAddress, amount);

    // Update user's token balance
    const newTokenBalance = await solanaService.getTokenBalance(user.wallet.solanaAddress);
    user.wallet.tokenBalance = newTokenBalance;
    await user.save();

    res.json({
      message: 'Tokens minted successfully',
      signature,
      amount,
      reason,
      newBalance: newTokenBalance
    });

  } catch (error) {
    console.error('Mint tokens error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transaction history
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // In a real implementation, you would query the blockchain for transaction history
    // For now, we'll return a mock response
    const transactions = [
      {
        signature: 'mock_signature_1',
        type: 'send',
        amount: 1.5,
        toAddress: 'mock_address_1',
        timestamp: new Date(Date.now() - 86400000),
        status: 'confirmed'
      },
      {
        signature: 'mock_signature_2',
        type: 'receive',
        amount: 2.0,
        fromAddress: 'mock_address_2',
        timestamp: new Date(Date.now() - 172800000),
        status: 'confirmed'
      }
    ];

    res.json({
      transactions: transactions.slice(0, parseInt(limit)),
      address: user.wallet.solanaAddress
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify message on blockchain
router.post('/verify-message', authenticateToken, async (req, res) => {
  try {
    const { messageHash, signature } = req.body;

    if (!messageHash || !signature) {
      return res.status(400).json({ message: 'Message hash and signature are required' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify message hash on blockchain
    const isVerified = await solanaService.verifyMessageHash(messageHash, signature);

    res.json({
      verified: isVerified,
      messageHash,
      signature
    });

  } catch (error) {
    console.error('Verify message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get wallet info
router.get('/wallet-info', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      address: user.wallet.solanaAddress,
      balance: user.wallet.balance,
      tokenBalance: user.wallet.tokenBalance,
      createdAt: user.createdAt
    });

  } catch (error) {
    console.error('Get wallet info error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate new wallet (for testing purposes)
router.post('/generate-wallet', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new wallet
    const newWallet = solanaService.generateWallet();

    // Update user's wallet
    user.wallet.solanaAddress = newWallet.publicKey;
    user.wallet.solanaPrivateKey = JSON.stringify(newWallet.secretKey);
    user.wallet.balance = 0;
    user.wallet.tokenBalance = 0;

    await user.save();

    res.json({
      message: 'New wallet generated successfully',
      address: newWallet.publicKey
    });

  } catch (error) {
    console.error('Generate wallet error:', error);
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
