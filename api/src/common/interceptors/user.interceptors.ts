import { Inject, Injectable, ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observable } from 'rxjs';

import { UserEntity } from 'src/user/entities/user.entity';
import { User as IUser } from 'src/common/interface/user.interface';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    @Inject(getRepositoryToken(UserEntity))
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user: IUser = request.user;
    if (user) {
      // check user if exists
      let existUser = await this.userRepo.findOne({ kcId: user.sub });

      // if not, insert to user table
      if (!existUser) {
        const newUser = this.userRepo.create({
          kcId: user.sub,
          firstName: user.given_name,
          lastName: user.family_name,
        });
        existUser = await this.userRepo.save(newUser);
      } else {
        // Existing user update it
        if (existUser.firstName !== user.given_name || existUser.lastName !== user.family_name) {
          existUser.firstName = user.given_name;
          existUser.lastName = user.family_name;
          existUser = await this.userRepo.save(existUser);
        }
      }

      request.dbUser = existUser;
    }

    return next.handle();
  }
}
