import { Controller, Get, Post, Body } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { LanguageEntity } from './entities/language.entity';
import { ApiTags } from '@nestjs/swagger';
import { RoleMatchingMode, Roles } from 'nest-keycloak-connect';

@ApiTags('language')
@Controller('language')
@Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async create(@Body() createLanguageDto: CreateLanguageDto): Promise<LanguageEntity> {
    return await this.languageService.create(createLanguageDto);
  }

  @Get()
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async findAll(): Promise<LanguageEntity[]> {
    return await this.languageService.findAll();
  }

  @Get('/names')
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async allLanguageNames(): Promise<string[]> {
    return this.languageService.getLanguageName();
  }
}
