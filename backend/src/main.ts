import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

/**
 * Bootstrap function to initialize and start the NestJS application
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3001;
  
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}/api`);
}

bootstrap();
