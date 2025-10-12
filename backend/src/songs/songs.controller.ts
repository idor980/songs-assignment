import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SongsService, SongsResponse } from './songs.service';

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
   * @returns Response with array of songs ordered by band name and count
   * @throws InternalServerErrorException if database operation fails
   */
  @Get()
  async getAllSongs(): Promise<SongsResponse> {
    try {
      this.logger.log('Fetching all songs');

      const songs = await this.songsService.getAllSongsOrderedByBand();

      return {
        data: songs,
        count: songs.length,
      };
    } catch (error) {
      this.logger.error('Error in get all songs endpoint', error);
      throw error;
    }
  }

  private validateUploadedFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException(
        'No file uploaded. Please upload a CSV file.',
      );
    }

    if (!file.originalname.toLowerCase().endsWith('.csv')) {
      throw new BadRequestException(
        'Invalid file type. Only CSV files are allowed.',
      );
    }

    // Note: File size limit is not specified in the assignment,
    // but is added as a security safeguard to prevent DoS attacks and excessive memory usage
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit.');
    }
  }
}
