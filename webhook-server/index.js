require('dotenv').config();
const fs = require('fs');
const https = require('https');
const path = require('path');
const crypto = require('crypto');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { createHandler } = require('@azure/functions-express');

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI);

const webhookSchema = new mongoose.Schema({
  event: String,
  payload: Object,
  receivedAt: { type: Date, default: Date.now }
});
const Webhook = mongoose.model('Webhook', webhookSchema);

const app = express();
app.use(express.json());
app.use(morgan('combined'));
const limiter = rateLimit({ windowMs: 60 * 1000, max: 100 });
app.use(limiter);

function verifyGithubSignature(req, res, next) {
  const signature = req.get('X-Hub-Signature-256') || '';
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET || '');
  const digest = `sha256=${hmac.update(JSON.stringify(req.body)).digest('hex')}`;
  try {
    if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
      return next();
    }
  } catch (err) {}
  return res.status(401).send('Signature mismatch');
}

app.post('/webhook', verifyGithubSignature, async (req, res) => {
  console.log('Received webhook:', req.body);
  await Webhook.create({ event: req.get('X-GitHub-Event'), payload: req.body });
  res.status(200).json({ received: true });
});

app.get('/events', async (req, res) => {
  const events = await Webhook.find().sort({ receivedAt: -1 }).limit(20);
  res.json(events);
});

app.use(express.static(path.join(__dirname, 'public')));

if (require.main === module) {
  const key = fs.readFileSync(process.env.SSL_KEY_PATH);
  const cert = fs.readFileSync(process.env.SSL_CERT_PATH);
  https.createServer({ key, cert }, app).listen(PORT, () => {
    console.log(`HTTPS Webhook receiver listening on port ${PORT}`);
  });
}

module.exports = createHandler(app);
