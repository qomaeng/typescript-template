import { Controller, Get, Header } from '@nestjs/common';

@Controller('/')
export class AppController {
  constructor() {
    // do nothing
  }

  @Get('health')
  @Header('content-type', 'text/plain')
  health(): string {
    return 'ok';
  }
}
