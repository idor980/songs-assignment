import {
  Injectable,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { parse } from 'csv-parse/sync';

export type SongData = {
  songName: string;
  band: string;
  year: number;
};

@Injectable()
export class SongsService {
  private readonly logger = new Logger(SongsService.name);

  constructor(private prisma: PrismaService) {}

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
    const records = parse(fileBuffer, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ';',
      trim: true,
    });

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
      throw new InternalServerErrorException(
        'Failed to fetch songs from database',
      );
    }
  }
}
