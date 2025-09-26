import crypto from 'crypto';

export class Transaction {
  constructor(fromAddress, toAddress, amount, publicKey = null) {
    this.from = fromAddress;
    this.to = toAddress;
    this.amount = amount;
    this.publicKey = publicKey; // PEM
    this.timestamp = Date.now();
    this.id = crypto.randomUUID();
  }

  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(this.from + this.to + this.amount + this.timestamp + this.id)
      .digest('hex');
  }

  sign(privateKey) {
    const sign = crypto.createSign('SHA256');
    sign.update(this.calculateHash());
    sign.end();
    this.signature = sign.sign(privateKey, 'hex');
    this.publicKey = crypto
      .createPublicKey(privateKey)
      .export({ type: 'spki', format: 'pem' });
    this.from = crypto
      .createHash('sha256')
      .update(this.publicKey)
      .digest('hex');
  }

  isValid() {
    if (this.from === null) return true; // mining reward
    if (!this.signature || !this.publicKey) return false;
    const addressCheck = crypto
      .createHash('sha256')
      .update(this.publicKey)
      .digest('hex');
    if (addressCheck !== this.from) return false;
    const verify = crypto.createVerify('SHA256');
    verify.update(this.calculateHash());
    verify.end();
    return verify.verify(this.publicKey, this.signature, 'hex');
  }
}
