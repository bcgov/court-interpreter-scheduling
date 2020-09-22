import { Logger } from '@nestjs/common';
import { Request, Response } from 'express';

export function logger(req: Request, res: Response, next: any) {
  // TODO figure oiut what we are logging per Request
  // eg: do we have access to user here?
  Logger.log(
    `${req.headers.origin} sent a ${req.method} request to ${req.path}`,
  );
  next();
}
