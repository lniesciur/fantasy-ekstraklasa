# Fantasy Ekstraklasa Optimizer

[![Node.js](https://img.shields.io/badge/Node.js-22.14.0-green.svg)](https://nodejs.org/)
[![Astro](https://img.shields.io/badge/Astro-5.13.7-orange.svg)](https://astro.build/)
[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.13-cyan.svg)](https://tailwindcss.com/)

## 🎯 Project Description

**Fantasy Ekstraklasa Optimizer** is an AI-powered web application designed to save time and improve decision-making for Fantasy Ekstraklasa players. The platform combines automated data collection, AI-driven lineup generation, and intuitive statistics visualization to help users create optimal fantasy football lineups.

### Key Features

- **🤖 AI Lineup Generation**: Powered by Openrouter.ai (Claude 3.5 Sonnet) to create optimized 15-player lineups
- **📊 Statistics Analysis**: Comprehensive player statistics with filtering, sorting, and comparison tools
- **📈 Data Import**: Both manual Excel import and automatic scraping from fantasy.ekstraklasa.org
- **🎯 Bonus System**: Strategic use of 3 bonuses per round (Bench Boost, Double Captain, Joker)
- **🔄 Transfer Tips**: AI-powered recommendations for player transfers between matchdays
- **📱 User Management**: Secure authentication with Supabase Auth and lineup history tracking
- **📊 Analytics**: Performance tracking and AI effectiveness metrics

### Target Audience

Experienced Fantasy Ekstraklasa players who want to:

- Reduce time spent on statistical analysis
- Improve lineup optimization through AI assistance
- Track performance and make data-driven decisions

## 🛠 Tech Stack

### Frontend

- **Astro 5** - Main framework for fast loading and minimal JavaScript
- **React 19** - Interactive components (lineup generation, forms)
- **TypeScript 5** - Static typing for better IDE support
- **Tailwind 4** - Utility-first CSS framework
- **Shadcn/ui** - React component library

### Backend & Database

- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Supabase Auth for user authentication
  - Real-time subscriptions for live updates
  - Row Level Security (RLS) for data protection

### Data & Scraping

- **Node.js/Python** - Web scraping from fantasy.ekstraklasa.org
- **Puppeteer/Playwright** - Automated data collection
- **Cron jobs** - Scheduled data updates

### AI & Machine Learning

- **Openrouter.ai** - Access to multiple AI models
  - Claude 3.5 Sonnet (primary)
  - GPT-4 (fallback)
  - Gemini Pro (alternative)

### Deployment & Infrastructure

- **DigitalOcean** - Application hosting
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

### Monitoring & Analytics

- **Sentry** - Error tracking and monitoring
- **Vercel Analytics** - Web analytics
- **Supabase Dashboard** - Database monitoring

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit hooks

## 🚀 Getting Started Locally

### Prerequisites

- **Node.js**: Version 22.14.0 (use `.nvmrc` file)
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/fantasy-ekstraklasa-optimizer.git
   cd fantasy-ekstraklasa-optimizer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the required environment variables (Supabase URL, API keys, etc.)

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4321` to view the application

### Environment Setup

Create a `.env` file with the following variables:

```env
# Supabase
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI
OPENROUTER_API_KEY=your_openrouter_api_key

# Scraping
SCRAPING_ENDPOINT=your_scraping_endpoint
```

## 📜 Available Scripts

| Script             | Description                              |
| ------------------ | ---------------------------------------- |
| `npm run dev`      | Start development server with hot reload |
| `npm run build`    | Build the application for production     |
| `npm run preview`  | Preview the production build locally     |
| `npm run lint`     | Run ESLint to check code quality         |
| `npm run lint:fix` | Fix ESLint errors automatically          |
| `npm run format`   | Format code using Prettier               |

## 🎯 Project Scope

### MVP Features (December 2025)

#### ✅ Core Functionality

- **Data Import**: Manual Excel import and automatic scraping
- **AI Lineup Generation**: Openrouter.ai integration with Claude 3.5 Sonnet
- **Statistics Browsing**: Player comparison and filtering tools
- **Bonus System**: Strategic use of 3 bonuses per round
- **Transfer Tips**: AI-powered transfer recommendations
- **User Management**: Registration, authentication, and lineup storage
- **Analytics**: Performance tracking and AI effectiveness metrics

#### ✅ Technical Features

- **Responsive Design**: Desktop and tablet optimization
- **Real-time Updates**: Live data synchronization
- **Error Handling**: Comprehensive error management with retry logic
- **Performance**: Sub-2-second loading times
- **Security**: Row-level security and data protection

### Success Metrics

- **75% AI Acceptance Rate**: Lineups with 0-2 modifications
- **75% Success Rate**: AI lineups scoring 50+ points
- **100 Users**: Target within 3 months of launch
- **<1% Error Rate**: System stability and reliability

### Out of Scope (Post-MVP)

- Guest mode (all features require registration)
- Mobile applications
- Social features and leagues
- Advanced analytics and charts
- Multi-language support
- Premium features and monetization

## 📅 Project Status

### Development Timeline

#### **October 2025 (M1) - Foundation**

- ✅ Astro + Supabase setup
- ✅ Authentication system
- ✅ Database schema design
- ✅ Scraping prototype implementation

#### **November 2025 (M2) - Core Features**

- 🔄 Openrouter.ai integration
- 🔄 AI lineup generation
- 🔄 User management system
- 🔄 Tutorial and onboarding

#### **December 2025 (M3) - Polish & Launch**

- ⏳ Testing and bug fixes
- ⏳ Performance optimization
- ⏳ Beta testing (5-10 users)
- ⏳ Production deployment

#### **January 2026 - Launch**

- 🎯 Soft launch with first users
- 🎯 Spring round implementation

### Current Status

**Development Phase**: Foundation setup completed, core features in progress

### Risk Mitigation

- **Scraping Dependencies**: Manual import backup system
- **AI Costs**: Fallback algorithms and prompt optimization
- **User Acquisition**: Community marketing and influencer partnerships

## 📄 License

This project is currently in development. License information will be added upon launch.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📞 Contact

For questions or support, please open an issue in the GitHub repository.

---

**Built with ❤️ for the Fantasy Ekstraklasa community**
