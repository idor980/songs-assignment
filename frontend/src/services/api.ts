import type { SongsResponse } from '../types/song';

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
   * @returns Promise with songs data
   * @throws Error if fetch fails
   */
  async getSongs(): Promise<SongsResponse> {
    try {
      const response = await fetch(`${API_URL}/songs`);

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
}

export const apiService = new ApiService();

