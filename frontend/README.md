# Frontend - Song Collection Manager

React frontend application for the Song Collection Manager.

## 🚀 Quick Start

### Using Docker
```bash
docker-compose up frontend
```

### Local Development
```bash
npm install
npm run dev
```

## 📝 Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── FileUpload.tsx  # CSV upload component
│   └── SongsTable.tsx  # Songs display table
├── services/           # API services
│   └── api.ts          # Backend API client
├── types/              # TypeScript types
│   └── song.ts         # Song interfaces
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## 🎨 Components

### FileUpload
Handles CSV file selection and upload with:
- Drag & drop support
- File validation (type, size)
- Upload progress indication
- Success/error messages

### SongsTable
Displays songs in a table with:
- Sorted by band name
- Loading states
- Empty state handling
- Refresh functionality
- Responsive design

## 🛠 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Flowbite React** - UI components
- **React Icons** - Icons

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## 🎨 Styling

Uses Tailwind CSS with custom configuration:
- Utility-first approach
- Responsive design
- Flowbite components
- Custom color scheme

## 🔧 API Integration

The `apiService` handles all backend communication:
- File uploads with FormData
- GET requests for songs list
- DELETE requests for clearing data
- Error handling

## 📱 Responsive Design

The application is fully responsive:
- Mobile-first approach
- Breakpoints for tablets and desktop
- Touch-friendly interfaces

## 🚀 Building for Production

```bash
npm run build
```

Creates optimized production build in `dist/` directory with:
- Minified JavaScript
- Optimized CSS
- Asset optimization
- Code splitting

## 🌐 Deployment

The Docker build uses Nginx to serve the static files:
- Gzip compression
- Client-side routing support
- Security headers
- Caching for static assets
