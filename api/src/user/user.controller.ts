import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { User } from './interfaces/user.interface';

@Controller('user')
export class UserController {
  @Get('/')
  async hello(@Req() req: any) {
    // return req.accessTokenJWT;
    return req.user;
  }
}
