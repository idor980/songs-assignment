import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongsService, SongData } from './songs.service';

/**
 * Songs Controller
 * Handles HTTP requests related to song operations
 */
@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  /**
   * Upload and process a CSV file containing songs
   * @param file - Uploaded CSV file
   * @returns Success message with count of processed songs
   */
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; count: number; data: SongData[] }> {
    try {
      this.logger.log(`Received file upload: ${file?.originalname}`);

      // Validate file exists
      if (!file) {
        throw new BadRequestException(
          'No file uploaded. Please upload a CSV file.',
        );
      }

      // Validate file type
      if (!file.originalname.toLowerCase().endsWith('.csv')) {
        throw new BadRequestException(
          'Invalid file type. Only CSV files are allowed.',
        );
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new BadRequestException('File size exceeds 10MB limit.');
      }

      // Process the CSV file
      const songs = await this.songsService.uploadAndParseCsv(file.buffer);

      return {
        message: 'CSV file processed successfully',
        count: songs.length,
        data: songs,
      };
    } catch (error) {
      this.logger.error('Error in upload endpoint', error);

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new BadRequestException('Failed to process uploaded file');
    }
  }

  /**
   * Get all songs ordered by band name
   * @returns Array of songs ordered by band name
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllSongs(): Promise<{ data: SongData[]; count: number }> {
    try {
      this.logger.log('Fetching all songs');

      const songs = await this.songsService.getAllSongsOrderedByBand();

      return {
        data: songs,
        count: songs.length,
      };
    } catch (error) {
      this.logger.error('Error in get all songs endpoint', error);
      throw new BadRequestException('Failed to fetch songs');
    }
  }

  /**
   * Delete all songs from the database
   * @returns Success message with count of deleted songs
   */
  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAllSongs(): Promise<{ message: string; count: number }> {
    try {
      this.logger.log('Deleting all songs');

      const count = await this.songsService.deleteAllSongs();

      return {
        message: 'All songs deleted successfully',
        count,
      };
    } catch (error) {
      this.logger.error('Error in delete all songs endpoint', error);
      throw new BadRequestException('Failed to delete songs');
    }
  }
}
