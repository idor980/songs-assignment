import { Badge, Spinner, Alert, Button } from 'flowbite-react';
import { HiExclamationCircle, HiMusicNote } from 'react-icons/hi';
import type { Song } from '../types/song';

interface SongsTableProps {
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

/**
 * SongsTable Component
 * Displays songs in a table format ordered by band name
 */
export const SongsTable = ({ songs, isLoading, error, onRefresh }: SongsTableProps) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Spinner size="xl" />
          <p className="text-gray-600">Loading songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <Alert color="failure" icon={HiExclamationCircle}>
          <div className="break-words">
            <span className="font-medium">Error!</span> {error}
          </div>
        </Alert>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <HiMusicNote className="text-6xl text-gray-300" />
          <p className="text-xl font-medium text-gray-600">No songs yet</p>
          <p className="text-gray-500">Upload a CSV file to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Song Collection
            </h2>
            <p className="text-gray-600 mt-1">
              Total: <Badge color="blue" className="inline-flex">{songs.length}</Badge> songs
            </p>
          </div>
          <Button onClick={onRefresh} color="light" size="sm" className="p-1">
            Refresh
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">
                  <div className="flex items-center">
                    Band Name
                    <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 10l5-5 5 5H5z" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3">Song Name</th>
                <th className="px-6 py-3">Year</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song, index) => (
                <tr
                  key={`${song.band}-${song.songName}-${index}`}
                  className="bg-white border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {song.band}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    {song.songName}
                  </td>
                  <td className="px-6 py-4">
                    <Badge color="purple">{song.year}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

