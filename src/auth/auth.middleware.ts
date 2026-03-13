import { type NestMiddleware, Injectable, Logger } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(this.constructor.name);

  constructor() {
    // do nothing
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async use(
    _request: FastifyRequest,
    _response: FastifyReply,
    next: (error?: Error) => void,
  ): Promise<any> {
    // TODO: Auth

    next();
  }
}
