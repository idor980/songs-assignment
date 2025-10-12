import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { parse } from 'csv-parse/sync';

/**
 * Interface representing a song record
 */
export interface SongData {
  songName: string;
  band: string;
  year: number;
}

/**
 * Songs Service
 * Handles business logic for song operations including CSV parsing and database interactions
 */
@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Parses a CSV file buffer and saves songs to the database
   * @param fileBuffer - The CSV file content as a Buffer
   * @returns Array of created song records
   * @throws BadRequestException if CSV parsing or validation fails
   */
  async uploadAndParseCsv(fileBuffer: Buffer): Promise<SongData[]> {
    try {
      this.logger.log('Starting CSV parsing');

      // Parse CSV with semicolon delimiter
      const records = parse(fileBuffer, {
        columns: true,
        skip_empty_lines: true,
        delimiter: ';',
        trim: true,
      });

      this.logger.log(`Parsed ${records.length} records from CSV`);

      // Validate and transform records
      const songsData: SongData[] = records.map(
        (record: Record<string, string>, index: number) => {
          const songName = record['Song Name']?.trim().toLowerCase();
          const band = record['Band']?.trim().toLowerCase();
          const year = parseInt(record['Year']?.trim(), 10);

          // Validate required fields
          if (!songName || !band) {
            throw new BadRequestException(
              `Missing required fields at row ${index + 2}. Song Name and Band are required.`,
            );
          }

          if (isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
            throw new BadRequestException(
              `Invalid year at row ${index + 2}. Year must be a valid number between 1900 and current year.`,
            );
          }

          return { songName, band, year };
        },
      );

      // Clear existing songs and insert new ones
      await this.prisma.song.deleteMany();
      this.logger.log('Cleared existing songs from database');

      // Batch insert songs
      const createdSongs = await this.prisma.song.createMany({
        data: songsData,
      });

      this.logger.log(
        `Successfully inserted ${createdSongs.count} songs into database`,
      );

      return songsData;
    } catch (error) {
      this.logger.error('Error processing CSV file', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException(
        `Failed to process CSV file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Retrieves all songs from the database ordered by band name
   * @returns Array of songs ordered by band name (ascending)
   */
  async getAllSongsOrderedByBand(): Promise<SongData[]> {
    try {
      this.logger.log('Fetching all songs ordered by band name');

      const songs = await this.prisma.song.findMany({
        orderBy: {
          band: 'asc',
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
      throw new BadRequestException('Failed to fetch songs from database');
    }
  }

  /**
   * Deletes all songs from the database
   * @returns Count of deleted records
   */
  async deleteAllSongs(): Promise<number> {
    try {
      this.logger.log('Deleting all songs from database');

      const result = await this.prisma.song.deleteMany();

      this.logger.log(`Deleted ${result.count} songs from database`);

      return result.count;
    } catch (error) {
      this.logger.error('Error deleting songs from database', error);
      throw new BadRequestException('Failed to delete songs from database');
    }
  }
}
