const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON payloads
app.use(express.json());

// POST /webhook endpoint to receive GitHub push events
app.post('/webhook', (req, res) => {
  // Log the full payload received from GitHub
  console.log('Received webhook:', req.body);

  // Respond with a 200 OK and acknowledgement JSON
  res.status(200).json({ received: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Webhook receiver listening on port ${PORT}`);
});
