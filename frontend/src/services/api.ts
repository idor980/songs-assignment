import type { SongsResponse } from '../types/song';

/**
 * API Base URL
 * Reads from environment variable with fallback for development convenience
 * Set VITE_API_URL in .env file to override
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * API Service for communicating with the backend
 */
class ApiService {
  /**
   * Uploads a CSV file to the backend
   * @param file - The CSV file to upload
   * @returns Promise with songs response
   * @throws Error if upload fails
   */
  async uploadCsv(file: File): Promise<SongsResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_URL}/songs/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload CSV file');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while uploading the file');
    }
  }

  /**
   * Fetches all songs ordered by band name
   * @param order - Sort order (asc or desc)
   * @returns Promise with songs data
   * @throws Error if fetch fails
   */
  async getSongs(order: 'asc' | 'desc' = 'asc'): Promise<SongsResponse> {
    try {
      const response = await fetch(`${API_URL}/songs?order=${order}`);

      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching songs');
    }
  }

  /**
   * Deletes all songs from the database
   * @returns Promise that resolves when deletion is complete
   * @throws Error if delete fails
   */
  async deleteAllSongs(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/songs`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete songs');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while deleting songs');
    }
  }
}

export const apiService = new ApiService();

