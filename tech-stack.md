# Tech Stack - Fantasy Ekstraklasa Optimizer

## Frontend
- **Astro 5** - Główny framework, szybkie ładowanie, minimalny JavaScript
- **React 19** - Komponenty interaktywne (generowanie składów, formularze)
- **TypeScript 5** - Statyczne typowanie, lepsze wsparcie IDE
- **Tailwind 4** - Utility-first CSS framework
- **Shadcn/ui** - Biblioteka komponentów React

## Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL - baza danych
  - Supabase Auth - autentykacja użytkowników
  - Real-time subscriptions - live updates
  - Row Level Security (RLS) - bezpieczeństwo danych

## Data & Scraping
- **Node.js/Python** - Scraping fantasy.ekstraklasa.org
- **Puppeteer/Playwright** - Web scraping
- **Cron jobs** - Automatyczne aktualizacje danych

## AI & Machine Learning
- **Openrouter.ai** - Dostęp do wielu modeli AI
  - Claude 3.5 Sonnet (domyślny)
  - GPT-4 (fallback)
  - Gemini Pro (alternatywa)
- **Prompt Engineering** - Optymalizacja promptów dla generowania składów

## Deployment & Infrastructure
- **DigitalOcean** - Hosting aplikacji
- **Docker** - Konteneryzacja
- **GitHub Actions** - CI/CD pipeline
- **Nginx** - Reverse proxy (opcjonalnie)

## Monitoring & Analytics
- **Sentry** - Error tracking i monitoring
- **Vercel Analytics** - Web analytics
- **Supabase Dashboard** - Monitoring bazy danych

## Development Tools
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Vitest** - Testing framework

## Security
- **Supabase RLS** - Row Level Security
- **Environment Variables** - API keys i secrets
- **HTTPS** - SSL/TLS encryption
- **CORS** - Cross-origin resource sharing

## Performance
- **Astro Islands** - Partial hydration
- **Image Optimization** - Astro built-in
- **Caching** - Supabase caching
- **CDN** - DigitalOcean Spaces (opcjonalnie)

## Cost Estimation (100 użytkowników)
- **Supabase**: $0-25/mies (darmowy tier do 50k MAU)
- **DigitalOcean**: $20-50/mies (droplet + database)
- **Openrouter.ai**: $10-30/mies (zależnie od użycia AI)
- **Monitoring**: $0-20/mies (Sentry free tier)
- **Total**: ~$30-125/mies

## Alternative Stack Options

### Minimalna (MVP)
- Next.js + CSS Modules + Supabase + OpenAI API + Vercel

### Enterprise
- Next.js + Styled Components + PlanetScale + Anthropic + AWS

## Why This Stack?

### ✅ Advantages
- **Szybki development** - Astro + Supabase = mniej kodu
- **Niskie koszty** - Darmowe/tańsze alternatywy
- **Skalowalność** - Supabase i DigitalOcean skalują automatycznie
- **Nowoczesne technologie** - Najnowsze wersje frameworków
- **Dobra dokumentacja** - Wszystkie technologie mają excellent docs

### ⚠️ Considerations
- **Single developer** - Brak redundancji w zespole
- **Scraping dependency** - Ryzyko zmiany struktury strony
- **AI costs** - Koszty mogą rosnąć z popularnością

## Next Steps
1. Setup Astro + Supabase project
2. Implement scraping prototype
3. Test Openrouter.ai integration
4. Design database schema
5. Create MVP wireframes
