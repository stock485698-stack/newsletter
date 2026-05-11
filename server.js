const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory subscriber storage (replace with database in production)
let subscribers = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Free tier signup
app.post('/api/signup', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (subscribers.find(sub => sub.email === email)) {
    return res.status(400).json({ error: 'Email already subscribed' });
  }
  
  subscribers.push({ email, tier: 'free', date: new Date() });
  res.json({ success: true, message: 'Subscribed to free tier' });
});

// Stripe checkout session
app.post('/api/checkout', (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Premium Newsletter Subscription',
            description: 'Monthly premium newsletter access',
          },
          unit_amount: 900, // $9.00
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${process.env.DOMAIN || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.DOMAIN || 'http://localhost:3000'}/`,
    customer_email: email,
  }, (err, session) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ sessionId: session.id });
  });
});

// Admin API - view all subscribers
app.get('/api/admin/subscribers', (req, res) => {
  res.json({ subscribers, count: subscribers.length });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Newsletter server running on http://localhost:${PORT}`);
});
