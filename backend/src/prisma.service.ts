import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma Service
 * Manages the connection to the PostgreSQL database using Prisma Client.
 * Implements lifecycle hooks to connect on module init and disconnect on destroy.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /**
   * Connects to the database when the module is initialized
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Disconnects from the database when the module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
