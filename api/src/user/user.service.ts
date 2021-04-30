import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from 'src/location/entities/location.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRO } from './ro/user.ro';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async update(updateUserDto: UpdateUserDto): Promise<UserRO> {
    const { id, kcId, locationId, firstName, lastName } = updateUserDto;
    let user: UserEntity;
    if (kcId) {
      user = await this.userRepository.findOneOrFail({ kcId });
    } else {
      user = await this.userRepository.findOneOrFail({ id });
    }

    if (locationId) {
      const location = await this.locationRepository.findOneOrFail({ id: locationId });
      user.location = location;
    }

    if (firstName) {
      user.firstName = firstName;
    }

    if (lastName) {
      user.lastName = lastName;
    }

    const saveUser = await this.userRepository.save(user);
    return saveUser.toResponseObject();
  }
}
