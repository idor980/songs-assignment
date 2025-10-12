# Song Collection Manager

Full-stack application to upload CSV files with songs and display them sorted by band name.

Built with NestJS, React, TypeScript, Prisma, and PostgreSQL.

## Quick Start

### 1. Setup Environment
```bash
cp .env.example .env
npm install
```

### 2. Start Backend
```bash
npm run dev
```
Backend runs on http://localhost:3001

### 3. Start Frontend (New Terminal)
```bash
npm run dev:frontend
```
Frontend runs on http://localhost:5173

### 4. Test
Open http://localhost:5173 and upload `F-S Test - T02 - 2023 - Song_list.csv`

## Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start database + backend |
| `npm run dev:frontend` | Start frontend |
| `npm run dev:backend` | Start backend only |
| `npm run db:start` | Start database only |
| `npm run db:stop` | Stop database |

## Configuration

All environment variables are in `.env` at the root:
- Database settings
- Backend port
- Frontend API URL

## Project Structure

```
songs-assignment/
├── backend/              # NestJS API
│   ├── src/             # Source code
│   ├── prisma/          # Database schema
│   └── .env            # → Symlink to ../.env
├── frontend/            # React App
│   ├── src/            # Source code
│   └── .env           # → Symlink to ../.env
├── .env               # Main config file
├── docker-compose.yml # PostgreSQL
└── package.json       # Root scripts
```

## Tech Stack

- **Backend**: NestJS, Prisma, PostgreSQL
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Flowbite
- **Database**: PostgreSQL (Docker)

## Troubleshooting

### Database Authentication Error

If you get `Authentication failed` error when running migrations:

```bash
# Reset the database
docker-compose down -v
docker-compose up -d
sleep 3

# Try again
cd backend
npm run prisma:migrate
npm run start:dev
```

