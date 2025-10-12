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
import { SongsService, SongData } from './songs.service';

@Controller('songs')
export class SongsController {
  private readonly logger = new Logger(SongsController.name);

  constructor(private readonly songsService: SongsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ message: string; count: number; data: SongData[] }> {
    try {
      this.logger.log(`Received file upload: ${file?.originalname}`);

      this.validateUploadedFile(file);

      const songs = await this.songsService.uploadCsv(file.buffer);

      return {
        message: 'CSV file processed successfully',
        count: songs.length,
        data: songs,
      };
    } catch (error) {
      this.logger.error('Error in upload endpoint', error);
      throw error;
    }
  }
  
  @Get()
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
      throw error; // Re-throw to let NestJS handle the HTTP response
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

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds 10MB limit.');
    }
  }
}
