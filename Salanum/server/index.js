const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const blockchainRoutes = require('./routes/blockchain');
const aiRoutes = require('./routes/ai');
const keeperRoutes = require('./routes/keeper');
const keeperFinalRoutes = require('./routes/keeper-final');

const { initializeSolana } = require('./services/solanaService');
const { initializeAI } = require('./services/aiService');
const { setupSocketHandlers } = require('./services/socketService');
const { setupCronJobs } = require('./services/cronService');
const { keeperService } = require('./services/KeeperService');
const OfflineKeeperServer = require('./services/OfflineKeeperServer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/keeper', keeperRoutes);
app.use('/api/keeper-final', keeperFinalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize services
async function initializeServices() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/solanum');
    console.log('✅ Connected to MongoDB');

    // Initialize Solana
    await initializeSolana();
    console.log('✅ Solana service initialized');

    // Initialize AI service
    await initializeAI();
    console.log('✅ AI service initialized');

    // Initialize Keeper service
    console.log('🔒 Initializing Keeper Protocol 14-Delta...');
    const keeperStatus = keeperService.getStatus();
    console.log('✅ Keeper service initialized:', keeperStatus);

    // Start Offline Keeper Server
    const offlineKeeperServer = new OfflineKeeperServer();
    offlineKeeperServer.start();
    console.log('✅ Offline Keeper Server started');

    // Setup Socket.IO handlers
    setupSocketHandlers(io);
    console.log('✅ Socket.IO handlers setup');

    // Setup cron jobs
    setupCronJobs();
    console.log('✅ Cron jobs setup');

  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
    process.exit(1);
  }
}

// Start server
const PORT = process.env.PORT || 5000;

initializeServices().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
});

module.exports = { app, server, io };
