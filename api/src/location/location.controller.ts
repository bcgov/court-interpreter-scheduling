import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { LocationService } from './location.service';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  findAll() {
    return this.locationService.findAll();
  }
}
