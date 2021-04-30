import { Body, Controller, Patch } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRO } from './ro/user.ro';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto): Promise<UserRO> {
    return this.userService.update(updateUserDto);
  }
}
