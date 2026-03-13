import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';

import type { AppConfig } from './app/app-config';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Get configs
  const config = app.get(ConfigService<AppConfig, true>);
  const host = config.getOrThrow<string>('HOST');
  const port = config.getOrThrow<number>('PORT');

  // Init API
  app.setGlobalPrefix(config.getOrThrow('API_PREFIX') || '');

  // Init HTTP Server
  const httpServer = app.getHttpAdapter().getInstance().server;
  httpServer.setTimeout(config.getOrThrow('HTTP_SOCKET_TIMEOUT'));
  httpServer.requestTimeout = config.getOrThrow('HTTP_REQUEST_TIMEOUT');
  httpServer.headersTimeout = config.getOrThrow('HTTP_HEADERS_TIMEOUT');
  httpServer.keepAliveTimeout = config.getOrThrow('HTTP_KEEP_ALIVE_TIMEOUT');

  // Enable CORS
  const cors = config.getOrThrow<string[]>('CORS');
  if (cors.length) {
    app.enableCors({
      origin: cors,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });
  }

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Listen HTTP clients
  await app.listen(port, host);
  Logger.log(`Listening at http://${host}:${port}`);
}

bootstrap().catch((error: Error) => {
  Logger.error(`Error occured while bootstraping the server: ${error}`, error.stack);
});
