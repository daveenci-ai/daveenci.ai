# DaVeenci AI Website

A modern, high-performance website for DaVeenci AI, featuring an agentic workflow, synthetic data pipelines, and integrated booking systems. This project is structured as a monorepo designed for seamless deployment on **Vercel** with a **Supabase** backend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm
- A Supabase Project
- Google Service Account (for Calendar integration)

### Local Development

1. **Clone and Install**:
```bash
git clone <your-repo-url>
cd daveenci.ai
npm run install-all
```

2. **Environment Setup**:
Create a `.env` file in the `backend/` directory based on `backend/env.example.txt` and fill in your Supabase and Google API credentials.

3. **Database Initialization**:
```bash
cd backend
npm run setup-db
npm run init-db
```

4. **Run Dev Servers**:
- **Frontend**: `cd frontend && npm run dev`
- **Backend**: `cd backend && npm run dev`

---

## 🏗 Project Structure

```text
.
├── api/                # Vercel Serverless Functions (Backend Entry)
├── backend/            # Express.js API & Business Logic
│   ├── src/            # TypeScript Source
│   └── .env            # Private Backend Environment Variables
├── frontend/           # Vite + React + Tailwind CSS
│   └── src/            # React Components & Services
├── package.json        # Root config for Vercel deployments
└── vercel.json         # Vercel routing & configuration
```

---

## 🛠 Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React.
- **Backend/API**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL (Supabase).
- **Integrations**: Google Calendar API.
- **Hosting**: Vercel (Frontend + Serverless Functions).

---

## ☁️ Deployment

### 1. Supabase Setup
- Ensure your database tables are created by running the local `setup-db` and `init-db` scripts pointing to your live instance.
- **Important**: Use the **Connection Pooler** URI (Transaction mode) if your local network doesn't support IPv6.

### 2. Vercel Deployment
- Connect your GitHub repository to Vercel.
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Root Directory**: `./`
- **Environment Variables**: Add all variables from `backend/.env` to the Vercel Project Settings.

---

## 📄 License
This project is proprietary. All rights reserved.
