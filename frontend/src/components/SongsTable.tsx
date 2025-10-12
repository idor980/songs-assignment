import { Badge, Spinner, Alert, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
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
          <Table hoverable>
            <TableHead>
              <TableHeadCell>#</TableHeadCell>
              <TableHeadCell>
                <div className="flex items-center">
                  Band Name
                  <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 10l5-5 5 5H5z" />
                  </svg>
                </div>
              </TableHeadCell>
              <TableHeadCell>Song Name</TableHeadCell>
              <TableHeadCell>Year</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {songs.map((song, index) => (
                <TableRow
                  key={`${song.band}-${song.songName}-${index}`}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell >
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900 dark:text-white">
                    {song.band}
                  </TableCell>
                  <TableCell>
                    {song.songName}
                  </TableCell>
                  <TableCell>
                    {song.year}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

