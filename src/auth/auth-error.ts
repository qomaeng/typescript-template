import { BaseError } from '@/common/common-error';

export abstract class AuthError extends BaseError {}

export class AuthenticationError extends AuthError {
  static readonly CODE = 'UNAUTHENTICATED';
  static readonly MESSAGE = 'Authentication error';
  static readonly HTTP_STATUS = 401; // Unauthorized
}

export class UnauthorizedError extends AuthError {
  static readonly CODE = 'UNAUTHORIZED';
  static readonly MESSAGE = 'Unauthorized error';
  static readonly HTTP_STATUS = 403; // Forbidden
}
