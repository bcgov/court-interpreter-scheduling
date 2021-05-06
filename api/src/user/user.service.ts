import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationEntity } from 'src/location/entities/location.entity';
import { Repository } from 'typeorm';
import { SaveLocationDTO } from './dto/save-location.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserRO } from './ro/user.ro';
import { User as IUser } from 'src/common/interface/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
  ) {}

  async getUserWithKeyCloakId(kcId: string): Promise<UserRO> {
    return (await this.userRepository.findOneOrFail({ kcId })).toResponseObject();
  }

  async saveLocation(data: SaveLocationDTO, user: IUser): Promise<UserRO> {
    if (data.locationId && user.id) {
      // Fetch location
      const location = await this.locationRepository.findOneOrFail({ id: data.locationId });
      const dbUser = await this.userRepository.findOneOrFail({ id: user.id });
      dbUser.location = location;
      return (await this.userRepository.save(dbUser)).toResponseObject();
    } else {
      throw new UnprocessableEntityException(`Unable to process locationId: ${data.locationId} or user: ${user.id}`);
    }
  }

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

    const saveUser = await this.userRepository.save(user);
    return saveUser.toResponseObject();
  }
}
