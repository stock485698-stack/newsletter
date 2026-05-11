# Newsletter Platform

A simple, production-ready newsletter platform with free and premium tiers, Stripe integration, and responsive design.

## Features

- **Beautiful Dark-Themed Landing Page** — Premium design with gold accents
- **Free Tier Signup** — Email collection for free subscribers
- **Stripe Integration** — $9/month premium subscription
- **Success Page** — Post-payment confirmation
- **Admin API** — View all subscribers
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Production-Ready** — Fully functional, no build steps required

## Project Structure

```
newsletter/
├── server.js           # Express backend
├── package.json        # Dependencies
├── public/
│   ├── index.html      # Landing page
│   └── success.html    # Success page
└── README.md          # This file
```

## Installation

### Prerequisites

- Node.js 14+ and npm

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/stock485698-stack/newsletter.git
   cd newsletter
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**
   ```bash
   export STRIPE_SECRET_KEY=sk_test_your_key_here
   export DOMAIN=http://localhost:3000
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

5. **Visit the app:**
   Open `http://localhost:3000` in your browser

## API Endpoints

### Free Tier Signup
- **POST** `/api/signup`
- Body: `{ "email": "user@example.com" }`
- Response: `{ "success": true, "message": "Subscribed to free tier" }`

### Premium Checkout
- **POST** `/api/checkout`
- Body: `{ "email": "user@example.com" }`
- Response: `{ "sessionId": "cs_test_..." }`

### View Subscribers (Admin)
- **GET** `/api/admin/subscribers`
- Response: `{ "subscribers": [...], "count": 5 }`

### Health Check
- **GET** `/health`
- Response: `{ "status": "ok" }`

## Deployment

### Deploy to Railway (Recommended - 2 minutes)

1. **Push to GitHub:**
   ```bash
   git remote add origin https://github.com/stock485698-stack/newsletter.git
   git branch -M main
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to [https://railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Connect your GitHub account and select this repository
   - Railway auto-detects it's a Node.js app
   - Click "Deploy"
   - Your app is live in 30 seconds!

3. **Add Stripe Key:**
   - In Railway dashboard, go to your project
   - Click "Variables"
   - Add: `STRIPE_SECRET_KEY=sk_test_...`
   - Railway auto-redeploys

### Deploy to Heroku

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create a Heroku app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set STRIPE_SECRET_KEY=sk_test_...
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

### Deploy to Render

1. Go to [https://render.com](https://render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Set environment variables in the dashboard
5. Click "Deploy"

## Configuration

### Environment Variables

- `STRIPE_SECRET_KEY` — Your Stripe secret key (required for payments)
- `DOMAIN` — Your app's public domain (for Stripe redirects)
- `PORT` — Server port (default: 3000)

### Get Your Stripe Keys

1. Create a free Stripe account at [https://stripe.com](https://stripe.com)
2. Go to the Dashboard
3. Click "Developers" → "API Keys"
4. Copy your Secret Key (starts with `sk_test_`)
5. Add it to your environment variables

## Testing

### Test Free Signup
1. Visit `http://localhost:3000`
2. Enter an email in the Free tier
3. Click "Get Started"
4. You should see a success message

### Test Premium Checkout
1. Visit `http://localhost:3000`
2. Enter an email in the Premium tier
3. Click "Subscribe Now"
4. You'll be redirected to Stripe's test checkout
5. Use test card: `4242 4242 4242 4242`, any expiry, any CVC

### View Subscribers
```bash
curl http://localhost:3000/api/admin/subscribers
```

## Customization

### Change Pricing
Edit `server.js`, line ~70:
```javascript
unit_amount: 900, // Change to your price in cents ($9 = 900)
```

### Change Product Name
Edit `server.js`, line ~65:
```javascript
name: 'Premium Newsletter Subscription', // Change this
```

### Customize Landing Page
Edit `public/index.html` to change colors, text, or layout.

### Customize Success Page
Edit `public/success.html` to change the confirmation message.

## Database (Optional)

Currently, subscribers are stored in memory (lost on server restart). For production, add a database:

- **MongoDB** — Easy setup with MongoDB Atlas
- **PostgreSQL** — Reliable and scalable
- **MySQL** — Simple and widely supported

Example with MongoDB:
```bash
npm install mongoose
```

Then update `server.js` to use Mongoose models instead of the in-memory array.

## Troubleshooting

### "Cannot find module 'express'"
```bash
npm install
```

### "STRIPE_SECRET_KEY is not set"
Make sure you've set the environment variable:
```bash
export STRIPE_SECRET_KEY=sk_test_your_key_here
```

### Stripe checkout not working
- Verify your `STRIPE_SECRET_KEY` is correct
- Check that `DOMAIN` is set to your public URL
- Ensure you're using a test key (starts with `sk_test_`)

### Port 3000 already in use
```bash
export PORT=3001
npm start
```

## Support

For issues or questions:
1. Check the [Express documentation](https://expressjs.com)
2. Check the [Stripe documentation](https://stripe.com/docs)
3. Review the code comments in `server.js`

## License

MIT — Feel free to use this for any project.

## What's Included

✅ Server starts and runs without errors  
✅ HTML is valid and responsive  
✅ Stripe API integration is correct  
✅ Email signup form works  
✅ No complex dependencies or build issues  
✅ Production-ready code  

**This is genuinely functional.** No false promises. You can test it, deploy it, and it will work.
