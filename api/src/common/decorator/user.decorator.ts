import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/** Get User Data */
export const User = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.user;
});

export const DBUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return req.dbUser;
});
