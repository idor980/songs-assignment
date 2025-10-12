import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { parse } from 'csv-parse/sync';

/**
 * Songs Service
 * Handles business logic for song operations including CSV parsing and database interactions
 */
@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Uploads and processes a CSV file containing songs
   * Parses CSV, validates data, and saves to database in a transaction
   * @param fileBuffer - The CSV file content as a Buffer
   * @returns Array of created song records
   * @throws BadRequestException if CSV parsing or validation fails
   * @throws InternalServerErrorException if database operation fails
   */
  async uploadCsv(fileBuffer: Buffer): Promise<SongData[]> {
    const songsData = this.parseAndValidate(fileBuffer);

    try {
      await this.prisma.$transaction(async (tx) => {
        await tx.song.deleteMany();
        this.logger.log('Cleared existing songs from database');

        const createdSongs = await tx.song.createMany({
          data: songsData,
        });

        this.logger.log(
          `Successfully inserted ${createdSongs.count} songs into database`,
        );
      });

      return songsData;
    } catch (error) {
      this.logger.error('Database error while saving songs', error);
      throw new InternalServerErrorException(
        'Failed to save songs to database',
      );
    }
  }

  private parseAndValidate(fileBuffer: Buffer): SongData[] {
    this.logger.log('Starting CSV parsing and validation');

    let records: Record<string, string>[];

    // Parse CSV with error handling
    try {
      records = parse(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
        trim: true,
      });

      this.logger.log(`Parsed ${records.length} records from CSV`);
    } catch (error) {
      this.logger.error('CSV parsing failed', error);
      throw new BadRequestException(
        "Invalid CSV format. File must include: 'Song Name', 'Band', and 'Year'.",
      );
    }

    // Validate and transform each record
    return records.map((record: Record<string, string>, index: number) => {
      const songName = record['Song Name']?.trim().toLowerCase();
      const band = record['Band']?.trim().toLowerCase();
      const year = parseInt(record['Year']?.trim(), 10);

      // Validate required fields
      if (!songName || !band) {
        throw new BadRequestException(
          `Missing required fields at row ${index + 2}. Song Name and Band are required.`,
        );
      }

      // Validate year is a number and within reasonable bounds
      // Note: Year range validation (1900-present) is not specified in the assignment,
      // but is added as a data quality safeguard to prevent invalid/unrealistic years
      if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
        throw new BadRequestException(
          `Invalid year at row ${index + 2}. Year must be a valid number between 1900 and current year.`,
        );
      }

      return { songName, band, year };
    });
  }

  /**
   * Retrieves all songs from the database ordered by band name
   * @param order - Sort order (asc or desc)
   * @returns Array of songs ordered by band name
   * @throws InternalServerErrorException if database operation fails
   */
  async getAllSongsOrderedByBand(
    order: 'asc' | 'desc' = 'asc',
  ): Promise<SongData[]> {
    try {
      this.logger.log(`Fetching all songs ordered by band name (${order})`);

      const songs = await this.prisma.song.findMany({
        orderBy: {
          band: order,
        },
        select: {
          songName: true,
          band: true,
          year: true,
        },
      });

      this.logger.log(`Retrieved ${songs.length} songs from database`);

      return songs;
    } catch (error) {
      this.logger.error('Error fetching songs from database', error);
      throw new InternalServerErrorException(
        'Failed to fetch songs from database',
      );
    }
  }

  /**
   * Deletes all songs from the database
   * @returns Count of deleted songs
   * @throws InternalServerErrorException if database operation fails
   */
  async deleteAllSongs(): Promise<void> {
    try {
      this.logger.log('Deleting all songs from database');

      const result = await this.prisma.song.deleteMany();

      this.logger.log(`Deleted ${result.count} songs from database`);

      return;
    } catch (error) {
      this.logger.error('Error deleting songs from database', error);
      throw new InternalServerErrorException(
        'Failed to delete songs from database',
      );
    }
  }
}

/**
 * Song Types
 *
 * ⚠️ Important: If these types change, the frontend types must be updated manually to match.
 */

/**
 * Represents a song record with lowercase text fields
 */
export type SongData = {
  songName: string;
  band: string;
  year: number;
};

/**
 * API response structure for song operations
 */
export type SongsResponse = {
  data: SongData[];
  count: number;
};
