# 🎯 AI Voice Deal Finder

**Professional AI-powered deal finder that calls multiple sellers, negotiates prices, and finds the best deals with real-time pricing.**

![AI Voice Deal Finder](https://img.shields.io/badge/AI-Voice%20Deal%20Finder-blue?style=for-the-badge&logo=robot)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

- **🤖 AI Voice Agent** - Simulates real phone calls to sellers
- **💰 Real-Time Pricing** - Live price updates every 3 seconds
- **📞 Professional Negotiations** - AI negotiates 5-15% savings
- **📧 Email Reports** - Professional deal summaries
- **🔗 Direct Product Links** - Links to actual product pages
- **📱 Mobile Responsive** - Works on all devices
- **⚡ Fast Search** - Results in under 10 seconds

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Email**: Resend API
- **Search**: Serper API (Google Search)
- **Voice**: OmniDimension API
- **Deployment**: Vercel

## 📦 Quick Setup

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/yourusername/ai-voice-deal-finder.git
cd ai-voice-deal-finder
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

### 3. Environment Variables
Create `.env.local` file in root directory:

\`\`\`env
# Required for email functionality
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx

# Optional - for enhanced features
SERPER_API_KEY=your_serper_api_key
OMNIDIMENSION_API_KEY=your_omnidimension_key
OMNIDIMENSION_BASE_URL=https://api.omnidimension.ai
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional - for real voice calls
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_phone
ELEVENLABS_API_KEY=your_elevenlabs_key
OPENAI_API_KEY=your_openai_key
\`\`\`

### 4. Get API Keys

#### 🔥 **REQUIRED - Resend (Email)**
1. Go to [resend.com](https://resend.com)
2. Sign up (FREE - 3,000 emails/month)
3. Dashboard → API Keys → Create
4. Copy key to `.env.local`

#### 🌟 **OPTIONAL - Enhanced Features**

**Serper (Google Search)**
1. Go to [serper.dev](https://serper.dev)
2. Sign up (FREE - 2,500 searches/month)
3. Get API key from dashboard

**OmniDimension (Voice AI)**
1. Go to [omnidimension.ai](https://omnidimension.ai)
2. Sign up for voice AI services
3. Get API key and base URL

### 5. Run Development Server
\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 How to Use

1. **Enter Product** - Type any product name (e.g., "iPhone 15 Pro")
2. **Add Email** - Optional email for reports
3. **Start Search** - Click "Start AI Search"
4. **Watch Magic** - AI finds sellers and negotiates prices
5. **View Results** - See best deals with real-time pricing
6. **Get Report** - Send professional email report

## 📱 Demo

### Search Process
\`\`\`
🔍 Finding verified sellers...
📞 AI making voice calls...
💰 Negotiating prices...
✅ Best deals found!
\`\`\`

### Sample Results
\`\`\`
🏆 Best Deal: Amazon - $949 (was $999)
🥈 Second: Walmart - $959 (was $1029)  
🥉 Third: Best Buy - $979 (was $1049)
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy `out` folder to Netlify
3. Add environment variables

### Deploy to Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy with one click

## 🔧 Configuration

### Email Setup
\`\`\`typescript
// app/api/send-email-report/route.ts
from: "onboarding@resend.dev" // Use this for testing
// For production, verify your domain in Resend
\`\`\`

### Real-Time Pricing
\`\`\`typescript
// Adjust update frequency (default: 3 seconds)
const interval = setInterval(() => {
  // Update prices
}, 3000)
\`\`\`

### Negotiation Settings
\`\`\`typescript
// Customize savings percentages
const negotiationPower = seller.name.includes("Costco") ? 0.1 : 0.05
\`\`\`

## 📊 API Endpoints

- `POST /api/send-email-report` - Send deal reports
- `POST /api/find-sellers` - Find product sellers
- `GET /api/test-apis` - Test API connections

## 🛡️ Error Handling

The system includes comprehensive error handling:
- **Graceful Fallbacks** - Works even if APIs fail
- **Premium Data** - Fallback seller database
- **Error Recovery** - Continues operation on failures
- **User Feedback** - Clear error messages

## 🎨 Customization

### Styling
- Edit `app/globals.css` for global styles
- Modify `tailwind.config.ts` for theme changes
- Update components in `components/ui/`

### Branding
- Change colors in Tailwind config
- Update logo and text in main component
- Customize email templates

## 📈 Performance

- **Fast Loading** - Optimized Next.js build
- **Real-Time Updates** - Efficient state management
- **Mobile Optimized** - Responsive design
- **SEO Ready** - Meta tags and structure

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-voice-deal-finder/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-voice-deal-finder/discussions)
- **Email**: support@yourproject.com

## 🌟 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Resend](https://resend.com/) - Email service
- [Vercel](https://vercel.com/) - Deployment platform

---

**Made with ❤️ for finding the best deals with AI**

## 🚀 Quick Start Commands

\`\`\`bash
# Clone and setup
git clone https://github.com/yourusername/ai-voice-deal-finder.git
cd ai-voice-deal-finder
npm install

# Add your Resend API key to .env.local
echo "RESEND_API_KEY=your_key_here" > .env.local

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
\`\`\`

**🎯 Ready to find the best deals with AI!**
