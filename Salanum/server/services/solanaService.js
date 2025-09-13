const { Connection, PublicKey, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } = require('@solana/spl-token');
const crypto = require('crypto');

class SolanaService {
  constructor() {
    this.connection = null;
    this.mint = null;
    this.tokenProgramId = null;
  }

  async initialize() {
    try {
      // Initialize connection to Solana network
      this.connection = new Connection(
        process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
        'confirmed'
      );

      // Create or get the messenger token mint
      await this.initializeMessengerToken();
      
      console.log('Solana service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Solana service:', error);
      throw error;
    }
  }

  async initializeMessengerToken() {
    try {
      // In production, you would use a pre-created mint
      // For development, we'll create a new mint
      const payer = Keypair.generate(); // In production, use your actual keypair
      
      // Airdrop SOL for transaction fees (only works on devnet/testnet)
      if (process.env.NODE_ENV === 'development') {
        const signature = await this.connection.requestAirdrop(
          payer.publicKey,
          LAMPORTS_PER_SOL
        );
        await this.connection.confirmTransaction(signature);
      }

      // Create messenger token mint
      this.mint = await createMint(
        this.connection,
        payer,
        payer.publicKey,
        null,
        9 // Decimals
      );

      this.tokenProgramId = this.mint;
      console.log('Messenger token mint created:', this.mint.toString());
    } catch (error) {
      console.error('Failed to create messenger token:', error);
      // In production, you might want to use a pre-existing mint
      throw error;
    }
  }

  // Generate a new wallet for user
  generateWallet() {
    const keypair = Keypair.generate();
    return {
      publicKey: keypair.publicKey.toString(),
      secretKey: Array.from(keypair.secretKey),
      address: keypair.publicKey.toString()
    };
  }

  // Get wallet balance
  async getBalance(publicKeyString) {
    try {
      const publicKey = new PublicKey(publicKeyString);
      const balance = await this.connection.getBalance(publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw error;
    }
  }

  // Get token balance
  async getTokenBalance(publicKeyString) {
    try {
      const publicKey = new PublicKey(publicKeyString);
      const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(
        publicKey,
        { mint: this.mint }
      );

      if (tokenAccounts.value.length === 0) {
        return 0;
      }

      return tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
    } catch (error) {
      console.error('Failed to get token balance:', error);
      return 0;
    }
  }

  // Send SOL transaction
  async sendSOL(fromPrivateKey, toPublicKey, amount) {
    try {
      const fromKeypair = Keypair.fromSecretKey(new Uint8Array(fromPrivateKey));
      const toPubkey = new PublicKey(toPublicKey);
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: toPubkey,
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      const signature = await this.connection.sendTransaction(transaction, [fromKeypair]);
      await this.connection.confirmTransaction(signature);
      
      return signature;
    } catch (error) {
      console.error('Failed to send SOL:', error);
      throw error;
    }
  }

  // Send messenger tokens
  async sendTokens(fromPrivateKey, toPublicKey, amount) {
    try {
      const fromKeypair = Keypair.fromSecretKey(new Uint8Array(fromPrivateKey));
      const toPubkey = new PublicKey(toPublicKey);

      // Get or create associated token accounts
      const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        fromKeypair,
        this.mint,
        fromKeypair.publicKey
      );

      const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        fromKeypair,
        this.mint,
        toPubkey
      );

      // Transfer tokens
      const signature = await transfer(
        this.connection,
        fromKeypair,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromKeypair,
        amount * Math.pow(10, 9) // Convert to smallest unit
      );

      return signature;
    } catch (error) {
      console.error('Failed to send tokens:', error);
      throw error;
    }
  }

  // Mint tokens to user (for rewards, etc.)
  async mintTokens(toPublicKey, amount) {
    try {
      const payer = Keypair.generate(); // In production, use your mint authority
      const toPubkey = new PublicKey(toPublicKey);

      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        this.connection,
        payer,
        this.mint,
        toPubkey
      );

      const signature = await mintTo(
        this.connection,
        payer,
        this.mint,
        tokenAccount.address,
        payer,
        amount * Math.pow(10, 9)
      );

      return signature;
    } catch (error) {
      console.error('Failed to mint tokens:', error);
      throw error;
    }
  }

  // Store message hash on blockchain
  async storeMessageHash(messageHash, senderPublicKey) {
    try {
      // Create a transaction that includes the message hash
      // This is a simplified version - in production you'd use a smart contract
      const transaction = new Transaction();
      
      // Add instruction to store hash (this would be a custom program instruction)
      // For now, we'll just return a mock signature
      const mockSignature = crypto.randomBytes(32).toString('hex');
      
      return mockSignature;
    } catch (error) {
      console.error('Failed to store message hash:', error);
      throw error;
    }
  }

  // Verify message hash on blockchain
  async verifyMessageHash(messageHash, signature) {
    try {
      // In production, this would verify against the blockchain
      // For now, return true as a mock
      return true;
    } catch (error) {
      console.error('Failed to verify message hash:', error);
      return false;
    }
  }
}

const solanaService = new SolanaService();

// Initialize Solana service
async function initializeSolana() {
  await solanaService.initialize();
}

module.exports = {
  solanaService,
  initializeSolana
};
