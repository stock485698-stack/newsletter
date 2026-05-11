const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder');
const path = require('path');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL Connection Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/newsletter'
});

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'your-email@gmail.com',
    pass: process.env.GMAIL_PASSWORD || 'your-app-password'
  }
});

// Read email template
let emailTemplate = '';
try {
  emailTemplate = fs.readFileSync(path.join(__dirname, 'email_template.html'), 'utf8');
} catch (error) {
  console.error('Error reading email template:', error);
}

// Initialize database
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        tier VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

initializeDatabase();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Function to send welcome email
async function sendWelcomeEmail(email) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER || 'your-email@gmail.com',
      to: email,
      subject: '📰 Welcome to The AI Investor - Your First Issue Inside!',
      html: emailTemplate,
      text: 'Welcome to The AI Investor newsletter! Please view this email in HTML format to see the full content.'
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    return false;
  }
}

// Free tier signup
app.post('/api/signup', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO subscribers (email, tier) VALUES ($1, $2) RETURNING *',
      [email, 'free']
    );
    
    // Send welcome email asynchronously (don't wait for it)
    sendWelcomeEmail(email);
    
    res.json({ success: true, message: 'Subscribed to free tier', subscriber: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Email already subscribed' });
    }
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Stripe checkout session
app.post('/api/checkout', async (req, res) => {
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
app.get('/api/admin/subscribers', async (req, res) => {
  try {
    const result = await pool.query('SELECT email, tier, created_at FROM subscribers ORDER BY created_at DESC');
    res.json({ subscribers: result.rows, count: result.rows.length });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Newsletter server running on http://localhost:${PORT}`);
});
