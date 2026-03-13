import { Module } from '@nestjs/common';

import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthMiddleware],
  exports: [AuthMiddleware],
})
export class AuthModule {}
