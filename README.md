# TON Marketplace - Telegram Mini App

A decentralized digital marketplace built as a Telegram Mini App (TWA) where users can buy and sell digital goods using TON cryptocurrency.

## 🚀 Features

### For Buyers
- Browse digital products (eBooks, tutorials, assets, etc.)
- Search and filter products by category, price, and rating
- Connect TON wallet (Tonkeeper, MyTonWallet, or manual input)
- Purchase products with TON cryptocurrency
- Access purchased content via hidden links
- Rate and review purchased items
- Report inappropriate content

### For Sellers
- Create and manage digital products
- Set prices in TON cryptocurrency
- View sales analytics and revenue
- Request seller verification
- Withdraw earnings
- Hide/show products

### For Admins
- Moderate reported content
- Approve/reject seller verifications
- Manage withdrawal requests
- View platform statistics
- Ban sellers and remove content

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Mobile-first design)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **Platform**: Telegram Web App (TWA)
- **Storage**: localStorage (Mock Database)

## 🏗 Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   └── modals/          # Modal components
├── pages/
│   ├── buyer/           # Buyer-specific pages
│   ├── seller/          # Seller-specific pages
│   └── admin/           # Admin-specific pages
├── services/            # Business logic and API services
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── utils/               # Helper functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ton-marketplace-twa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_ADMIN_PASSWORD=admin123
VITE_APP_NAME=TON Marketplace
```

## 📱 Telegram Integration

This app is designed to run inside Telegram as a Mini App. To test:

1. Create a bot with [@BotFather](https://t.me/botfather)
2. Set up the Mini App with your deployed URL
3. Configure the bot menu button to open your Mini App

## 🎮 Demo Mode

The app includes a demo mode with pre-filled data:

- **Demo Buyer**: Pre-loaded with 50 TON balance and sample products
- **Demo Seller**: Has existing products and sales history
- **Admin Access**: Password is `admin123`

## 🔧 Key Features Implementation

### Mock Database Service
- Uses localStorage for data persistence
- Simulates real-time database operations
- Handles user sessions and data relationships

### Wallet Integration
- Simulates TON wallet connections
- Generates realistic wallet addresses
- Includes testnet faucet functionality

### Purchase Flow
- Validates wallet connection and balance
- Processes payments with platform fees (0.1 TON)
- Delivers hidden content links after purchase

### Admin Panel
- Protected with password authentication
- Comprehensive moderation tools
- Real-time statistics and analytics

## 🎨 Design System

- **Primary Color**: TON Blue (#0088cc)
- **Mobile-first**: Optimized for mobile devices
- **Animations**: Smooth fade-in and slide-up transitions
- **Native Feel**: Hidden scrollbars and native-like interactions

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🔒 Security Features

- Input validation and sanitization
- Protected admin routes
- Secure wallet address generation
- XSS protection through React

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.