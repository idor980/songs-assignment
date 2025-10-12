/**
 * Song Types
 * 
 * Note: These types are duplicated from the backend (backend/src/songs/songs.service.ts).
 * - Song mirrors backend SongData
 * - SongsResponse mirrors backend SongsResponse
 * 
 * For a larger project, these types would be shared via a common package, 
 * but for this assignment, duplication keeps setup simple.
 * 
 * ⚠️ Important: If backend types change, these types must be updated manually to match.
 */

/**
 * Represents a song entity
 */
export type Song = {
  songName: string;
  band: string;
  year: number;
}

/**
 * API response structure for song operations
 * Used by both GET /songs and POST /songs/upload endpoints
 */
export type SongsResponse = {
  data: Song[];
  count: number;
}

