const crypto = require('crypto');
const bcrypt = require('bcryptjs');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.tagLength = 16; // 128 bits
  }

  // Generate a new encryption key for user
  generateUserKey() {
    return crypto.randomBytes(this.keyLength).toString('hex');
  }

  // Derive key from user password
  async deriveKeyFromPassword(password, salt) {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(password, salt, 100000, this.keyLength, 'sha512', (err, derivedKey) => {
        if (err) reject(err);
        else resolve(derivedKey);
      });
    });
  }

  // Generate salt for password
  generateSalt() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Hash password with salt
  async hashPassword(password, salt) {
    return bcrypt.hash(password + salt, 12);
  }

  // Verify password
  async verifyPassword(password, salt, hashedPassword) {
    return bcrypt.compare(password + salt, hashedPassword);
  }

  // Encrypt message with user's key
  encryptMessage(message, userKey) {
    try {
      const key = Buffer.from(userKey, 'hex');
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from('messenger-app', 'utf8'));

      let encrypted = cipher.update(message, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();

      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt message');
    }
  }

  // Decrypt message with user's key
  decryptMessage(encryptedData, userKey) {
    try {
      const key = Buffer.from(userKey, 'hex');
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const tag = Buffer.from(encryptedData.tag, 'hex');
      
      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAAD(Buffer.from('messenger-app', 'utf8'));
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt message');
    }
  }

  // Encrypt file data
  encryptFile(fileBuffer, userKey) {
    try {
      const key = Buffer.from(userKey, 'hex');
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from('messenger-file', 'utf8'));

      const encrypted = Buffer.concat([
        cipher.update(fileBuffer),
        cipher.final()
      ]);
      
      const tag = cipher.getAuthTag();

      return {
        encrypted: encrypted.toString('base64'),
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      console.error('File encryption failed:', error);
      throw new Error('Failed to encrypt file');
    }
  }

  // Decrypt file data
  decryptFile(encryptedData, userKey) {
    try {
      const key = Buffer.from(userKey, 'hex');
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const tag = Buffer.from(encryptedData.tag, 'hex');
      const encryptedBuffer = Buffer.from(encryptedData.encrypted, 'base64');
      
      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAAD(Buffer.from('messenger-file', 'utf8'));
      decipher.setAuthTag(tag);

      const decrypted = Buffer.concat([
        decipher.update(encryptedBuffer),
        decipher.final()
      ]);

      return decrypted;
    } catch (error) {
      console.error('File decryption failed:', error);
      throw new Error('Failed to decrypt file');
    }
  }

  // Generate message hash for blockchain storage
  generateMessageHash(message, timestamp, senderId) {
    const data = message + timestamp + senderId;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Verify message integrity
  verifyMessageIntegrity(message, hash, timestamp, senderId) {
    const expectedHash = this.generateMessageHash(message, timestamp, senderId);
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  }

  // Generate secure random token
  generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  // Create digital signature
  createSignature(data, privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    return sign.sign(privateKey, 'hex');
  }

  // Verify digital signature
  verifySignature(data, signature, publicKey) {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    return verify.verify(publicKey, signature, 'hex');
  }

  // Generate key pair for digital signatures
  generateKeyPair() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return { publicKey, privateKey };
  }

  // Encrypt user's private key with master password
  encryptPrivateKey(privateKey, masterPassword) {
    const salt = this.generateSalt();
    const key = crypto.scryptSync(masterPassword, salt, this.keyLength);
    const iv = crypto.randomBytes(this.ivLength);
    
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encrypted = cipher.update(privateKey, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      encrypted,
      salt,
      iv: iv.toString('hex')
    };
  }

  // Decrypt user's private key with master password
  decryptPrivateKey(encryptedData, masterPassword) {
    const key = crypto.scryptSync(masterPassword, encryptedData.salt, this.keyLength);
    const iv = Buffer.from(encryptedData.iv, 'hex');
    
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Secure key exchange (simplified version)
  generateSharedSecret(user1Key, user2Key) {
    const combined = user1Key + user2Key;
    return crypto.createHash('sha256').update(combined).digest('hex');
  }

  // End-to-end encryption for messages between users
  encryptForRecipient(message, senderKey, recipientPublicKey) {
    // Generate ephemeral key pair for this message
    const ephemeralKeyPair = this.generateKeyPair();
    
    // Create shared secret
    const sharedSecret = this.generateSharedSecret(
      ephemeralKeyPair.privateKey,
      recipientPublicKey
    );

    // Encrypt message with shared secret
    const encrypted = this.encryptMessage(message, sharedSecret);

    return {
      encrypted,
      ephemeralPublicKey: ephemeralKeyPair.publicKey,
      timestamp: Date.now()
    };
  }

  // Decrypt message from sender
  decryptFromSender(encryptedData, recipientPrivateKey, senderPublicKey) {
    // Recreate shared secret
    const sharedSecret = this.generateSharedSecret(
      recipientPrivateKey,
      senderPublicKey
    );

    // Decrypt message
    return this.decryptMessage(encryptedData.encrypted, sharedSecret);
  }
}

const encryptionService = new EncryptionService();

module.exports = {
  encryptionService
};
