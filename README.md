# DaVeenci

AI & Automation Consultancy with an AI-powered blog system. Built with a clean monorepo structure for scalability and maintainability.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- OpenAI API key

### Installation

```bash
# Install all dependencies (root + workspaces)
npm install

# Or install individually
npm install --workspace=@crowley/web
npm install --workspace=@crowley/api
```

### Development

```bash
# Start both servers (recommended)
npm run dev

# Or start individually
npm run dev:web    # Frontend only (port 8080)
npm run dev:api    # Backend only (port 3001)

# Or use the script
./scripts/dev.sh
```

### Environment Setup

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# OpenAI
OPENAI_API_KEY=sk-...
VITE_OPENAI_API_KEY=sk-...

# Admin
VITE_ADMIN_PASSWORD=your-secure-password

# API
VITE_API_URL=http://localhost:3001/api
```

---

## 📁 Project Structure

```
daveenci/
├── apps/
│   ├── web/                    # Frontend (React + Vite)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── CCV/       # DaVeenci specific components
│   │   │   │   └── ui/        # Reusable UI (Shadcn)
│   │   │   ├── pages/         # Page components
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── lib/           # Utilities
│   │   │   ├── services/      # API services
│   │   │   ├── config/        # Configuration
│   │   │   └── context/       # React context
│   │   ├── public/            # Static assets
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/                    # Backend (Node + Express)
│       ├── src/
│       │   └── server.js      # API server
│       ├── package.json
│       └── README.md
│
├── docs/                       # 📚 All documentation
│   ├── README.md              # Documentation index
│   ├── setup/                 # Setup guides
│   ├── features/              # Feature docs
│   ├── architecture/          # Technical docs
│   ├── content/               # Content strategy
│   └── history/               # Project history
│
├── scripts/                    # Utility scripts
│   ├── dev.sh                 # Start dev servers
│   └── build.sh               # Build for production
│
├── .cursorrules               # AI assistant rules
├── .env.example               # Environment template
├── package.json               # Root workspace config
├── render.yaml                # Render deployment config
└── README.md                  # This file
```

---

## 🎯 Features

### 🏠 Homepage
- Modern, responsive design
- DaVeenci branding
- Custom Google Calendar booking
- Newsletter subscription

### 📝 Blog System
- AI-powered article generation
- SEO/AEO optimized content
- Admin dashboard
- Automatic publishing

### 🔐 Admin Panel
- Password protected (`/admin`)
- Article generation with AI
- Topic management
- Model selection (GPT-4o, GPT-4o-mini)
- Publication management

---

## 📚 Documentation

**All documentation is in the [`docs/`](docs/) folder.**

### Quick Links
- 🚀 [Backend Setup](docs/setup/backend.md)
- 🌍 [Environment Setup](docs/setup/environment.md)
- ✨ [Blog System](docs/features/blog-system.md)
- 🤖 [AI Integration](docs/features/ai-integration.md)
- 🏗️ [API Guide](docs/architecture/api-guide.md)
- 📊 [Database Schema](docs/architecture/database-schema.md)
- 📝 [SEO Strategy](docs/content/seo-strategy.md)

**See [docs/README.md](docs/README.md) for the complete documentation index.**

---

## 🛠️ Tech Stack

### Frontend (`apps/web/`)
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI (Radix UI)
- **Routing:** React Router v6
- **State:** React Query

### Backend (`apps/api/`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** pg (native driver)

### AI & Content
- **AI Provider:** OpenAI
- **Models:** GPT-4o, GPT-4o-mini
- **Features:** Article generation, SEO optimization

---

## 📝 Scripts

### Root Level (Workspace)
```bash
npm run dev              # Start both web + api
npm run dev:web          # Start web only
npm run dev:api          # Start api only
npm run build            # Build web for production
npm run start:api        # Start api in production
npm run lint             # Lint web code
npm run clean            # Remove all node_modules
npm run install:all      # Install all dependencies
```

### Web App (`apps/web/`)
```bash
cd apps/web
npm run dev              # Dev server (port 8080)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Lint code
```

### API (`apps/api/`)
```bash
cd apps/api
npm run dev              # Dev server with watch mode
npm start                # Production server
```

### Utility Scripts
```bash
./scripts/dev.sh                        # Start all dev servers
./scripts/build.sh                      # Build for production

# Test Scripts
node scripts/test-image-generation.js   # Test DALL-E image generation
node scripts/image-generation-example.js # Simple image generation example
```

See [scripts/README-IMAGE-TEST.md](scripts/README-IMAGE-TEST.md) for detailed image generation docs.

---

## 🚀 Deployment

### Using Render (Recommended)

1. **Connect Repository**
   - Link your GitHub/GitLab repo to Render
   - Render will auto-detect `render.yaml`

2. **Set Environment Variables**
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `VITE_OPENAI_API_KEY` - Same as above (for frontend)
   - `VITE_ADMIN_PASSWORD` - Admin panel password
   - `DATABASE_URL` - Auto-configured by Render

3. **Deploy**
   - Push to main branch
   - Render will automatically deploy

### Manual Deployment

#### Frontend (Static Site)
```bash
cd apps/web
npm install
npm run build
# Deploy dist/ folder to any static host
```

#### Backend (Node.js)
```bash
cd apps/api
npm install
PORT=3001 npm start
```

---

## 🔒 Security

- Admin panel password protected
- Environment variables for sensitive data
- API key validation
- Input sanitization
- CORS configured
- SQL injection prevention (parameterized queries)

---

## 📊 Database Schema

### Tables
- `articles` - Blog articles with AI-generated content
- `articles_settings` - AI generation settings and topics

See [Database Schema](docs/architecture/database-schema.md) for details.

---

## 🎨 Design System

- **Colors:** Black, Slate, White
- **Typography:** Inter font family
- **Components:** Shadcn UI
- **Responsive:** Mobile-first approach
- **Animations:** Smooth transitions
- **Utilities:** Tailwind CSS

---

## 🧪 Testing

```bash
# Frontend tests (if configured)
cd apps/web && npm test

# Backend tests (if configured)
cd apps/api && npm test
```

---

## 📈 Performance

- Optimized React components
- Code splitting
- Image optimization
- Lazy loading
- Memoization where needed
- Clean architecture for maintainability

See [Performance Fixes](docs/history/performance-fixes.md) for details.

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit a pull request

### Development Guidelines
- Follow `.cursorrules` for coding standards
- Keep components small and focused
- Write meaningful commit messages
- Update docs when adding features

---

## 📦 Monorepo Benefits

### Why This Structure?
- ✅ **Clean Separation** - Frontend and backend are isolated
- ✅ **Scalable** - Easy to add new apps (mobile, admin, etc.)
- ✅ **Maintainable** - Clear boundaries and responsibilities
- ✅ **Professional** - Industry-standard structure
- ✅ **Documented** - Everything is well-organized

### Workspaces
This project uses npm workspaces for monorepo management:
- `@daveenci/web` - Frontend application
- `@daveenci/api` - Backend API

---

## 🎯 Routes

### Frontend
- `/` - DaVeenci homepage
- `/articles` - Blog articles listing
- `/articles/:slug` - Individual article page
- `/admin` - Admin dashboard (password protected)

### Backend API
- `GET /health` - Health check
- `GET /api/articles` - List all articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles/generate` - Generate new article
- `GET /api/settings` - Get AI settings
- `POST /api/settings` - Update AI settings

---

## 📜 License

Proprietary - DaVeenci

---

## 📞 Support

Contact: astrid@daveenci.com

---

## 🎉 Status

✅ **Production Ready**
- Clean monorepo structure
- R2 cloud storage integration
- Google Calendar booking system
- Custom newsletter
- Scalable architecture
- Active development

---

## 🏗️ Architecture Highlights

### Monorepo Structure
- Isolated apps with clear boundaries
- Shared documentation
- Centralized scripts
- Workspace management

### Frontend
- Component-based architecture
- Reusable UI library (Shadcn)
- Type-safe with TypeScript
- Fast builds with Vite

### Backend
- RESTful API design
- Cloudflare R2 storage
- Google Calendar API integration
- Newsletter management
- PostgreSQL with parameterized queries

### Deployment
- Multi-service architecture on Render
- Static site + API + Database
- Cloudflare R2 for images
- Auto-deploy on push
- Health checks configured

---

**Built with ❤️ by Anton & Astrid**

**Architecture:** Clean Monorepo  
**Status:** Production Ready  
**Last Updated:** November 4, 2024