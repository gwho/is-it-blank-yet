import { Block } from './block.js';
import { Transaction } from './transaction.js';
import crypto from 'crypto';

export class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(0, Date.now().toString(), [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingTransactions(minerAddress) {
    const rewardTx = new Transaction(null, minerAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    const block = new Block(
      this.chain.length,
      Date.now().toString(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    const start = Date.now();
    block.mine(this.difficulty);
    const end = Date.now();
    this.chain.push(block);

    this.pendingTransactions = [];

    // simple difficulty adjustment
    const time = end - start;
    if (time < 1000) this.difficulty++;
    else if (time > 5000 && this.difficulty > 1) this.difficulty--;
  }

  addTransaction(tx) {
    if (!tx.from || !tx.to) throw new Error('Transaction must include from and to');
    if (!tx.isValid()) throw new Error('Invalid transaction');
    this.pendingTransactions.push(tx);
  }

  getBalance(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const tx of block.transactions) {
        if (tx.from === address) balance -= tx.amount;
        if (tx.to === address) balance += tx.amount;
      }
    }
    return balance;
  }

  isChainValid(chain = this.chain) {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const prev = chain[i - 1];

      if (!current.hasValidTransactions()) return false;
      if (current.hash !== current.computeHash()) return false;
      if (current.previousHash !== prev.hash) return false;
    }
    return true;
  }

  replaceChain(newChain) {
    if (newChain.length > this.chain.length && this.isChainValid(newChain)) {
      this.chain = newChain;
    }
  }
}
