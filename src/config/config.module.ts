import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env.development', '.env'],
      expandVariables: true,
    }),
  ],
  providers: [AppConfig],
  exports: [NestConfigModule, AppConfig],
})
export class ConfigModule {}
