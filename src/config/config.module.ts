import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './database.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        `.env.${process.env.NODE_ENV || 'development'}`,
        '.env.local',
      ],
      expandVariables: true,
    }),
  ],
  providers: [DatabaseConfig],
  exports: [NestConfigModule, DatabaseConfig],
})
export class ConfigModule {}