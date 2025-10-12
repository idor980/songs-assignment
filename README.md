# Songs Assignment

A full-stack application for managing songs with NestJS backend and PostgreSQL database.

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd songs-assignment
```

### 2. Set Up Environment Variables

Create `.env` file in the **root directory**:

```bash
cp .env.example .env
```

Create `.env` file in the **backend directory**:

```bash
cp backend/.env.example backend/.env
```

> **Note**: You can modify the default values in these `.env` files if needed. Make sure the database credentials match between root `.env` and `backend/.env`.

### 3. Run the Application

From the **root directory**, run:

```bash
npm run dev
```

This single command will:
- ✅ Start the PostgreSQL database in Docker
- ✅ Install backend dependencies
- ✅ Run database migrations
- ✅ Generate Prisma Client
- ✅ Start the NestJS backend in development mode

The backend will be available at: **http://localhost:3000**

## 📦 Available Scripts

### Root Directory Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start everything (DB + backend setup + backend dev server) |
| `npm run db:up` | Start the PostgreSQL database container |
| `npm run db:down` | Stop the database container |
| `npm run db:reset` | Reset database (removes all data and restarts) |
| `npm run backend:dev` | Start backend in development mode (watch mode) |
| `npm run backend:build` | Build backend for production |
| `npm run backend:start` | Start backend in production mode |

### Backend Directory Scripts

Navigate to `backend/` directory and run:

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start in development mode with hot-reload |
| `npm run build` | Build the application |
| `npm run start:prod` | Start in production mode |
| `npm run test` | Run unit tests |
| `npm run test:e2e` | Run end-to-end tests |

## 🗄️ Database Management

### View Database with Prisma Studio

```bash
cd backend
npx prisma studio
```

This opens a visual editor for your database at http://localhost:5555

### Create a New Migration

After modifying the Prisma schema:

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Reset Database

```bash
npm run db:reset
```

## 📊 Sample Data

The repository includes a sample CSV file (`F-S Test - T02 - 2023 - Song_list.csv`) with song data that can be imported into the database.

## 🏗️ Project Structure

```
songs-assignment/
├── backend/                 # NestJS backend application
│   ├── src/                # Source code
│   ├── prisma/             # Prisma schema and migrations
│   │   └── schema.prisma   # Database schema
│   ├── dist/               # Compiled output
│   └── package.json        # Backend dependencies
├── docker-compose.yml      # Docker configuration for PostgreSQL
├── .env                    # Root environment variables (for Docker)
├── .env.example            # Root environment template
└── README.md               # This file
```

## 🔧 Manual Setup (Alternative)

If you prefer to run commands separately:

```bash
# 1. Start database
docker-compose up -d

# 2. Wait a few seconds for DB to initialize
sleep 3

# 3. Install backend dependencies
cd backend
npm install

# 4. Run migrations
npx prisma migrate dev

# 5. Start backend
npm run start:dev
```

## 🛑 Stopping the Application

To stop the backend, press `Ctrl+C` in the terminal.

To stop the database:

```bash
npm run db:down
```

## 🐛 Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Make sure Docker is running
2. Check if database is up: `docker-compose ps`
3. Verify your `.env` files have matching credentials
4. Try resetting the database: `npm run db:reset`

### Port Already in Use

If port 5432 (PostgreSQL) or 3000 (NestJS) is already in use:

- Change `DB_PORT` in root `.env` file
- Update `DATABASE_URL` in `backend/.env` accordingly
- Change NestJS port in `backend/src/main.ts` if needed

## 📝 License

[MIT License](LICENSE)

