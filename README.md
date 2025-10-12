# Song Collection Manager

A full-stack web application for managing song collections. Upload CSV files containing songs and view them sorted by band name.

Built with **NestJS**, **React**, **TypeScript**, **Prisma**, and **PostgreSQL**.

---

## Features

- Upload CSV files with song data
- Automatic text transformation to lowercase
- Store songs in PostgreSQL database
- Display songs in a sortable table by band name
- Clean, modern, and responsive UI
- Full TypeScript support
- Comprehensive error handling

---

## Tech Stack

### Backend
- **NestJS** - Node.js framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database (Docker)
- **TypeScript** - Type safety

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Flowbite** - UI components

---

## Quick Start

### Prerequisites

- Node.js v20+
- Docker Desktop
- npm

### Installation

1. **Clone and setup**
   ```bash
   git clone <repo-url>
   cd songs-assignment
   cp .env.example .env
   npm install
   ```

2. **Start Backend** (Terminal 1)
   ```bash
   npm run dev
   ```
   Backend will be available at http://localhost:3001

3. **Start Frontend** (Terminal 2)
   ```bash
   npm run dev:frontend
   ```
   Frontend will be available at http://localhost:5173

4. **Test the app**
   - Open http://localhost:5173
   - Upload the included `F-S Test - T02 - 2023 - Song_list.csv` file
   - View your songs sorted by band name

---

## Commands

All commands run from the root directory:

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

## Project Structure

```
songs-assignment/
├── .env                    # Environment variables (single config)
├── .env.example            # Environment template
├── package.json            # Root scripts and commands
├── docker-compose.yml      # PostgreSQL configuration
│
├── backend/                # NestJS API
│   ├── src/
│   │   ├── main.ts        # Application entry point
│   │   ├── app.module.ts  # Root module
│   │   ├── prisma.service.ts  # Database service
│   │   └── songs/         # Songs feature module
│   │       ├── songs.controller.ts  # API endpoints
│   │       ├── songs.service.ts     # Business logic
│   │       └── songs.module.ts      # Module definition
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/    # Database migrations
│   └── .env               # Symlink to root .env
│
└── frontend/              # React application
    ├── src/
    │   ├── App.tsx        # Main component
    │   ├── components/    # React components
    │   ├── services/      # API client
    │   └── types/         # TypeScript definitions
    └── .env               # Symlink to root .env
```

---

## Configuration

All environment variables are stored in a single `.env` file at the root:

```env
# Database Configuration
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=songs_db
DB_PORT=5432

# Backend Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/songs_db?schema=public"
PORT=3001

# Frontend Configuration
VITE_API_URL=http://localhost:3001/api
FRONTEND_URL=http://localhost:5173
```

Both backend and frontend use this single config file via symlinks.

---

## API Endpoints

Base URL: `http://localhost:3001/api`

### Upload CSV File
```
POST /songs/upload
Content-Type: multipart/form-data

Body: file (CSV file)

Response: {
  "message": "CSV file processed successfully",
  "count": 11,
  "data": [...]
}
```

### Get All Songs
```
GET /songs

Response: {
  "data": [...],
  "count": 11
}
```
Songs are returned sorted by band name in ascending order.

### Delete All Songs
```
DELETE /songs

Response: {
  "message": "All songs deleted successfully",
  "count": 11
}
```

---

## CSV File Format

The application expects CSV files with semicolon delimiters:

```csv
Song Name;Band;Year
Crazy;Aerosmith;1990
With Or Without You;U2;1988
Billy Jean;Michael Jackson;1982
```

**Requirements:**
- Delimiter: semicolon (`;`)
- Headers: Song Name, Band, Year
- Year must be between 1900 and current year

---

## Development

### Code Formatting

Format all code with Prettier:
```bash
npm run format
```

### Code Linting

Check and fix code issues:
```bash
npm run lint
```

### Database Management

```bash
cd backend

# View database in browser
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

---

## Troubleshooting

### Database Authentication Error

If you get an authentication error when running migrations:

```bash
# Reset the database
docker-compose down -v
docker-compose up -d
sleep 3

# Try migration again
cd backend
npm run prisma:migrate
npm run start:dev
```

### Port Already in Use

If ports 3001, 5173, or 5432 are already in use:
- Stop the process using that port
- Or change the port in `.env` file

### Cannot Connect to Database

Make sure Docker Desktop is running:
```bash
docker ps
```

If the database container is not running:
```bash
npm run db:start
```

---

## Stopping the Application

1. Press `Ctrl+C` in both terminal windows (backend and frontend)
2. Stop the database:
   ```bash
   npm run db:stop
   ```

---

## License

UNLICENSED

---

## Assignment Requirements

This project fulfills the following requirements:
- ✅ Reads CSV files and transforms text to lowercase
- ✅ Stores data in PostgreSQL database
- ✅ Displays songs in a table sorted by band name
- ✅ Uses Node.js backend with NestJS
- ✅ Uses React frontend with TypeScript
- ✅ Uses Docker for database
- ✅ Includes error handlers and try-catch blocks
- ✅ Clean, well-documented code
- ✅ Production-ready structure
