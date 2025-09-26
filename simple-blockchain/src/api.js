import express from 'express';
import { Blockchain } from './blockchain.js';
import { Wallet } from './wallet.js';
import { Transaction } from './transaction.js';

const app = express();
app.use(express.json());

const chain = new Blockchain();
const wallets = {};

app.post('/wallets', (req, res) => {
  const wallet = new Wallet();
  wallets[wallet.address] = wallet;
  res.json({ address: wallet.address, publicKey: wallet.publicKey, privateKey: wallet.privateKey });
});

app.get('/chain', (req, res) => {
  res.json(chain.chain);
});

app.get('/balance/:address', (req, res) => {
  const address = req.params.address;
  res.json({ balance: chain.getBalance(address) });
});

app.post('/transactions', (req, res) => {
  const { from, to, amount, privateKey } = req.body;
  if (!from || !to || !amount || !privateKey) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const tx = new Transaction(from, to, amount);
  tx.sign(privateKey);
  try {
    chain.addTransaction(tx);
    res.json({ status: 'accepted', id: tx.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/mine', (req, res) => {
  const { address } = req.body;
  if (!address) return res.status(400).json({ error: 'Missing miner address' });
  chain.minePendingTransactions(address);
  res.json({ status: 'mined', chainLength: chain.chain.length, difficulty: chain.difficulty });
});

const PORT = process.env.PORT || 3000;
if (process.argv[1].includes('api.js')) {
  app.listen(PORT, () => console.log(`Blockchain API listening on ${PORT}`));
}

export { app, chain, wallets };
