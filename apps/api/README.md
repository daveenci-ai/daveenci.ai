# DaVeenci Backend API

Express.js backend for the DaVeenci blog system with AI-powered content generation, Google Calendar integration, and Cloudflare R2 storage.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/api
npm install
```

### 2. Configure Environment

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/daveenci_crm

# OpenAI
OPENAI_API_KEY=sk-...

# Cloudflare R2 Storage
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=daveenci-images
R2_PUBLIC_URL=https://pub-xxx.r2.dev

# Google Calendar
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY=...
GOOGLE_CALENDAR_ID=anton.osipov@daveenci.com
GOOGLE_ADMIN_EMAIL=anton.osipov@daveenci.com

# Server
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3001`

---

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Settings

**Get Settings:**
```
GET /api/settings
```

**Save Settings:**
```
PUT /api/settings
Body: { topics: [], schedule: "0 9 * * 1", auto: false, model: "gpt-4o-mini" }
```

### Articles

**Get All Articles:**
```
GET /api/articles?status=published&search=keyword&limit=100
```

**Get Single Article:**
```
GET /api/articles/:id
```

**Create Article:**
```
POST /api/articles
Body: { title, description, article, url, topic, featured, ... }
```

**Update Article:**
```
PUT /api/articles/:id
Body: { title, status, featured, ... }
```

**Delete Article:**
```
DELETE /api/articles/:id
```

**Generate Article:**
```
POST /api/articles/generate
Body: { topic, keywords }
```

### Bookings (Google Calendar)

**Get Available Slots:**
```
GET /api/bookings/availability?date=2024-11-05&meetingType=30min-fit-check
```

**Create Booking:**
```
POST /api/bookings
Body: { name, email, company, meetingType, dateTime, ... }
```

**Get Booking:**
```
GET /api/bookings/:id
```

**Cancel Booking:**
```
DELETE /api/bookings/:id
```

### Newsletter

**Subscribe:**
```
POST /api/newsletter/subscribe
Body: { email, name, interests }
```

**Get Subscribers:**
```
GET /api/newsletter/subscribers
```

**Unsubscribe:**
```
POST /api/newsletter/unsubscribe
Body: { email }
```

---

## 🔧 Features

- ✅ **AI Article Generation** - OpenAI integration with custom prompts
- ✅ **Image Generation** - DALL-E 3 with brand-compliant prompts
- ✅ **R2 Storage** - Cloudflare R2 for persistent image storage
- ✅ **Google Calendar** - Custom booking system with domain-wide delegation
- ✅ **Newsletter** - Custom subscription management
- ✅ **PostgreSQL** - Render-hosted database
- ✅ **Cron Jobs** - Scheduled article generation

---

## 📦 Dependencies

- **express** - Web framework
- **pg** - PostgreSQL client
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **openai** - OpenAI API client
- **sharp** - Image processing
- **googleapis** - Google Calendar API
- **@aws-sdk/client-s3** - Cloudflare R2 storage
- **node-cron** - Scheduled tasks

---

## 🔐 Security Notes

- Never commit `.env` file to git
- Use strong database passwords
- In production, use HTTPS
- Rotate API keys every 90 days
- Restrict R2 token permissions to bucket-level

---

## 📝 Documentation

- **CLOUDFLARE-R2-SETUP.md** - Complete R2 setup guide
- **GOOGLE-CALENDAR-SETUP.md** - Google Calendar API setup (if exists)

---

**Last Updated:** November 4, 2024  
**Team:** Anton & Astrid  
**Contact:** astrid@daveenci.com
