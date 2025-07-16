import crypto from 'crypto';
import { Transaction } from './transaction.js';

export class Wallet {
  constructor() {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'secp256k1',
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
    this.privateKey = privateKey;
    this.publicKey = publicKey;
    this.address = crypto.createHash('sha256').update(publicKey).digest('hex');
  }

  createTransaction(toAddress, amount) {
    const tx = new Transaction(this.address, toAddress, amount);
    tx.sign(this.privateKey);
    return tx;
  }

  balance(blockchain) {
    return blockchain.getBalance(this.address);
  }
}
