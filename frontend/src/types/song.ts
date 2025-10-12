/**
 * Interface representing a song entity
 */
export interface Song {
  songName: string;
  band: string;
  year: number;
}

/**
 * API response for fetching songs
 */
export interface SongsResponse {
  data: Song[];
  count: number;
}

/**
 * API response for uploading CSV
 */
export interface UploadResponse {
  message: string;
  count: number;
  data: Song[];
}

