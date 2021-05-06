import { Body, Controller, Get, Patch } from '@nestjs/common';

import { User } from 'src/common/decorator/user.decorator';
import { User as IUser } from 'src/common/interface/user.interface';
import { SaveLocationDTO } from './dto/save-location.dto';
import { UserRO } from './ro/user.ro';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch('/save-location')
  async saveLocation(@Body() body: SaveLocationDTO, @User() user: IUser): Promise<UserRO> {
    return this.userService.saveLocation(body, user);
  }

  @Get()
  async userDetails(@User() user: IUser): Promise<UserRO> {
    return this.userService.getUserWithKeyCloakId(user.kcId);
  }
}
