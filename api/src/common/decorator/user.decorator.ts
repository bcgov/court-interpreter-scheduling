import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User as IUser } from '../interface/user.interface';

/** Get User Data */
export const User = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<{ user: IUser }>();
  return req.user;
});
