import { Module } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';

/**
 * Root application module
 * Imports all feature modules
 */
@Module({
  imports: [SongsModule],
})
export class AppModule {}
