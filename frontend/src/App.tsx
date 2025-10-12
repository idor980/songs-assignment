import { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { SongsTable } from './components/SongsTable';
import { apiService } from './services/api';
import type { Song } from './types/song';
import { HiMusicNote } from 'react-icons/hi';

/**
 * Main App Component
 * Manages the application state and coordinates between upload and display components
 */
function App() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches songs from the backend
   */
  const fetchSongs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getSongs();
      setSongs(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load songs');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles successful file upload
   */
  const handleUploadSuccess = () => {
    fetchSongs();
  };

  // Fetch songs on component mount
  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <HiMusicNote className="text-4xl text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Song Collection Manager
            </h1>
          </div>
          <p className="text-center text-gray-600 mt-2">
            Upload and manage your favorite songs
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Upload Section */}
        <FileUpload onUploadSuccess={handleUploadSuccess} />

        {/* Songs Table Section */}
        <SongsTable
          songs={songs}
          isLoading={isLoading}
          error={error}
          onRefresh={fetchSongs}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Built with React, TypeScript, Tailwind CSS, and NestJS</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
