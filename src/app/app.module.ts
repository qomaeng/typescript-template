import {
  type MiddlewareConsumer,
  type NestModule,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { AuthMiddleware } from '@/auth/auth.middleware';
import { AuthModule } from '@/auth/auth.module';

import { AppConfig } from './app-config';
import { AppController } from './app.controller';
import { HttpExceptionFilter } from './http-exception.filter';
import { LoggingMiddleware } from './logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (envs: Record<string, any>) => AppConfig.parse(envs),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    return consumer
      .apply(LoggingMiddleware, AuthMiddleware)
      .exclude(
        { path: '{*path}', method: RequestMethod.OPTIONS },
        { path: 'health', method: RequestMethod.GET },
        { path: 'docs/{*path}', method: RequestMethod.GET },
      )
      .forRoutes({ path: '{*path}', method: RequestMethod.ALL });
  }
}
