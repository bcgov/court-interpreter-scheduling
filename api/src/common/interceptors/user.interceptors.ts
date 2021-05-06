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
    const kcUser: IUser = request.user;
    if (kcUser && kcUser.sub) {
      // check user if exists
      let dbUser = await this.userRepo.findOne({ kcId: kcUser.sub });

      // if not, insert to user table
      if (!dbUser) {
        const newUser = this.userRepo.create({
          kcId: kcUser.sub,
          firstName: kcUser.given_name,
          lastName: kcUser.family_name,
          guId: kcUser.guid,
        });
        dbUser = await this.userRepo.save(newUser);
      } else {
        // Existing user update it
        if (
          dbUser.firstName !== kcUser.given_name ||
          dbUser.lastName !== kcUser.family_name ||
          dbUser.guId !== kcUser.guid
        ) {
          dbUser.firstName = kcUser.given_name;
          dbUser.lastName = kcUser.family_name;
          dbUser.guId = kcUser.guid;
          dbUser = await this.userRepo.save(dbUser);
        }
      }

      request.dbUser = dbUser;
    }

    return next.handle();
  }
}
