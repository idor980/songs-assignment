import { Badge, Spinner, Alert, Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { HiExclamationCircle, HiMusicNote, HiTrash, HiChevronUp, HiChevronDown } from 'react-icons/hi';
import type { Song } from '../types/song';

interface SongsTableProps {
  songs: Song[];
  isLoading: boolean;
  error: string | null;
  sortOrder: 'asc' | 'desc';
  onSortChange: (order: 'asc' | 'desc') => void;
  onDeleteAll: () => void;
}

/**
 * SongsTable Component
 * Displays songs in a table format ordered by band name
 */
export const SongsTable = ({ songs, isLoading, error, sortOrder, onSortChange, onDeleteAll }: SongsTableProps) => {
  /**
   * Toggles sort order between ascending and descending
   */
  const handleSortToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(newOrder);
  };
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
          <Button onClick={onDeleteAll} color="failure" size="sm" className="p-2">
            <HiTrash className="mr-2 h-4 w-4" />
            Delete All
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table hoverable>
            <TableHead>
              <TableHeadCell>#</TableHeadCell>
              <TableHeadCell>
                <button 
                  type="button"
                  onClick={handleSortToggle}
                  className="flex items-center hover:text-blue-600 transition-colors cursor-pointer"
                  title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
                >
                  Band Name
                  {sortOrder === 'asc' ? (
                    <HiChevronUp className="w-5 h-5 ml-1" />
                  ) : (
                    <HiChevronDown className="w-5 h-5 ml-1" />
                  )}
                </button>
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

