import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';

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
  providers: [AppConfig],
  exports: [NestConfigModule, AppConfig],
})
export class ConfigModule {}
