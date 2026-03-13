import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { AuthenticationError, UnauthorizedError } from '@/auth/auth-error';
import { BaseError, InvalidArgumentsError, UnknownError } from '@/common/common-error';

import { AppConfig } from './app-config';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter, OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);

  private printErrorStack: boolean = false;
  private ignoreUrls: RegExp[] = [];
  private ignoreErrors: string[] = [];

  constructor(
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {
    // do nothing
  }

  onModuleInit() {
    this.printErrorStack = this.configService.getOrThrow('LOGGING_ERROR_STACK');
    this.ignoreUrls = this.configService
      .getOrThrow<string[]>('LOGGING_ERROR_IGNORE_URLS')
      .map((url) => new RegExp(url));
    this.ignoreErrors = this.configService.getOrThrow('LOGGING_ERROR_IGNORE_NAMES');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const context = host.switchToHttp();
    const request: FastifyRequest = context.getRequest();
    const pathname = request.url.split('?', 1)[0] ?? '/';

    // Handle first error only
    if (Array.isArray(exception)) {
      exception = exception[0];
    }

    // Override trivial errors
    if (exception instanceof UnauthorizedException) {
      exception = new AuthenticationError();
    } else if (exception instanceof ForbiddenException) {
      exception = new UnauthorizedError();
    } else if (exception instanceof ZodError) {
      const message = JSON.stringify(exception.format());
      exception = new InvalidArgumentsError(message);
    }

    // Log errors
    if (this.ignoreUrls.find((regex) => regex.test(pathname))) {
      // No logging when URL path is set to be ignored
    } else if (
      exception instanceof Error &&
      this.ignoreErrors.find((error) => error === exception.name)
    ) {
      // No logging when error is set to be ignored
    } else {
      this.logger.error(
        `${request.ip} <- ${request.method} ${request.url}: ${
          this.printErrorStack && exception instanceof Error
            ? exception.stack
            : String(exception)
        }`,
      );
    }

    // Build error response
    let httpStatus: number;
    let errorCode: string;
    let message: string;

    // TODO: Catch exceptions & export logic to method
    if (exception instanceof UnknownError) {
      httpStatus = exception.options.httpStatus ?? UnknownError.HTTP_STATUS;
      errorCode = exception.code;
      message = UnknownError.MESSAGE; // hide unknown error message
    } else if (exception instanceof BaseError) {
      httpStatus = exception.options.httpStatus ?? UnknownError.HTTP_STATUS;
      errorCode = exception.code;
      message = exception.message;
    } else if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      errorCode = UnknownError.CODE;
      message = exception.message;
    } else {
      httpStatus = UnknownError.HTTP_STATUS;
      errorCode = UnknownError.CODE;
      message = UnknownError.MESSAGE; // hide unchecked error message
    }

    // Build response
    const response = context.getResponse<FastifyReply>();
    const body = {
      error: errorCode,
      message,
    };

    // Send error response
    httpAdapter.reply(response, body, httpStatus);
  }
}
