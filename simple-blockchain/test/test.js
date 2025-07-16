import { Blockchain } from '../src/blockchain.js';
import { Wallet } from '../src/wallet.js';

const chain = new Blockchain();
const alice = new Wallet();
const bob = new Wallet();

const tx1 = alice.createTransaction(bob.address, 10);
chain.addTransaction(tx1);

console.log('Mining...');
chain.minePendingTransactions(alice.address);

console.log('Alice balance:', chain.getBalance(alice.address));
console.log('Bob balance:', chain.getBalance(bob.address));

if (!chain.isChainValid()) {
  console.error('Chain invalid');
  process.exit(1);
}
console.log('Test passed');
