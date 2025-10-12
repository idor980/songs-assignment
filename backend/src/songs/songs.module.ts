import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { PrismaService } from '../prisma.service';

/**
 * Songs Module
 * Encapsulates all song-related functionality
 */
@Module({
  controllers: [SongsController],
  providers: [SongsService, PrismaService],
})
export class SongsModule {}

