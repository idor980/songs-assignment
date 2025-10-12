import {
  Controller,
  Post,
  Get,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { SongsResponse } from './songs.service';
import { SongsService } from './songs.service';
import {
  MAX_FILE_SIZE,
  ALLOWED_FILE_EXTENSIONS,
} from '../constants/validation';

/**
 * Songs Controller
 * Handles HTTP requests for song operations
 */
@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  /**
   * Upload and process a CSV file containing songs
   * @param file - Uploaded CSV file
   * @returns Response with count of processed songs and song data
   * @throws BadRequestException if file validation or CSV parsing fails
   * @throws InternalServerErrorException if database operation fails
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<SongsResponse> {
    try {
      this.logger.log(`Received file upload: ${file?.originalname}`);

      this.validateUploadedFile(file);

      const songs = await this.songsService.uploadCsv(file.buffer);

      return {
        data: songs,
        count: songs.length,
      };
    } catch (error) {
      this.logger.error('Error in upload endpoint', error);
      throw error;
    }
  }

  /**
   * Get all songs ordered by band name
   * @param order - Sort order (asc or desc)
   * @returns Response with array of songs ordered by band name and count
   * @throws InternalServerErrorException if database operation fails
   */
  @Get()
  async getAllSongs(
    @Query('order') order: 'asc' | 'desc' = 'asc',
  ): Promise<SongsResponse> {
    try {
      this.logger.log(`Fetching all songs (order: ${order})`);

      const songs = await this.songsService.getAllSongsOrderedByBand(order);

      return {
        data: songs,
        count: songs.length,
      };
    } catch (error) {
      this.logger.error('Error in get all songs endpoint', error);
      throw error;
    }
  }

  /**
   * Delete all songs from the database
   * @returns Response with count of deleted songs
   * @throws InternalServerErrorException if database operation fails
   */
  @Delete()
  async deleteAllSongs(): Promise<void> {
    try {
      this.logger.log('Deleting all songs');
      await this.songsService.deleteAllSongs();
      return;
    } catch (error) {
      this.logger.error('Error in delete all songs endpoint', error);
      throw error;
    }
  }
  private validateUploadedFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded. Please upload a CSV file.',
      );
    }

    // Validate file type
    const hasValidExtension = ALLOWED_FILE_EXTENSIONS.some((ext) =>
      file.originalname.toLowerCase().endsWith(ext),
    );
    if (!hasValidExtension) {
      throw new BadRequestException(
        'Invalid file type. Only CSV files are allowed.',
      );
    }

    // Validate file size
    // Note: File size limit is not specified in the assignment,
    // but is added as a security safeguard to prevent DoS attacks and excessive memory usage
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`,
      );
    }
  }
}
