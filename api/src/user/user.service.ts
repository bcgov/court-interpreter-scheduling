import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from 'src/location/entities/location.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async update(updateUserDto: UpdateUserDto) {
    const { kcId, locationId } = updateUserDto;
    const location = await this.locationRepository.findOneOrFail({ id: locationId });
    const user = await this.userRepository.findOneOrFail({ kcId });
    user.location = location;
    return await this.userRepository.save(user);
  }
}
