# Song Collection Manager

Upload CSV files with song data and view them sorted by band name. Built with **NestJS**, **React**, **TypeScript**, **Prisma**, and **PostgreSQL**.

---

## Quick Start

**Prerequisites:** Node.js v20+, Docker Desktop

```bash
# 1. Clone and setup
git clone <repo-url>
cd songs-assignment
cp .env.example .env
npm install

# 2. Start backend (Terminal 1)
npm run dev
# Backend available at http://localhost:3001

# 3. Start frontend (Terminal 2)
npm run dev:frontend
# Frontend available at http://localhost:5173

# 4. Test the app
# - Open http://localhost:5173
# - Upload 'F-S Test - T02 - 2023 - Song_list.csv'
# - View your songs sorted by band name
```

---

## Commands

Run from the root directory:

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies (backend + frontend) |
| `npm run dev` | Start database and backend server |
| `npm run dev:frontend` | Start frontend development server |
| `npm run dev:backend` | Start backend only (requires DB running) |
| `npm run db:start` | Start PostgreSQL database only |
| `npm run db:stop` | Stop PostgreSQL database |
| `npm run format` | Format code with Prettier |
| `npm run lint` | Check and fix code issues with ESLint |

---

## Tech Stack

**Backend:** NestJS, Prisma ORM, PostgreSQL (Docker), TypeScript  
**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Flowbite  
**Features:** CSV parsing, automatic lowercase transformation, error handling, responsive UI

---

## Project Structure

```
songs-assignment/
├── backend/              # NestJS API
│   ├── src/
│   │   ├── songs/       # Songs feature (controller, service, module)
│   │   ├── main.ts      # Application entry point
│   │   └── prisma.service.ts  # Database service
│   └── prisma/
│       └── schema.prisma      # Database schema & migrations
│
├── frontend/            # React + Vite
│   └── src/
│       ├── components/  # FileUpload, SongsTable
│       ├── services/    # API client
│       └── types/       # TypeScript definitions
│
├── docker-compose.yml   # PostgreSQL database
└── .env                 # Single config file (shared by backend & frontend)
```

---

## Configuration

All environment variables in a single `.env` file at root:

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=songs_db
DB_PORT=5432

# Backend
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/songs_db?schema=public"
PORT=3001

# Frontend
VITE_API_URL=http://localhost:3001/api
FRONTEND_URL=http://localhost:5173
```

---

## API Endpoints

Base URL: `http://localhost:3001/api`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| `POST` | `/songs/upload` | Upload CSV file | `{ data: Song[], count: number }` |
| `GET` | `/songs` | Get all songs (sorted by band) | `{ data: Song[], count: number }` |

**CSV Format:** Semicolon-delimited with headers `Song Name;Band;Year`

---

