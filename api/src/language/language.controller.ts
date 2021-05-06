import { Controller, Get, Post, Body } from '@nestjs/common';
import { LanguageService } from './language.service';
import { CreateLanguageDto } from './dto/create-language.dto';
import { LanguageEntity } from './entities/language.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('language')
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  async create(@Body() createLanguageDto: CreateLanguageDto): Promise<LanguageEntity> {
    return await this.languageService.create(createLanguageDto);
  }

  @Get()
  async findAll(): Promise<LanguageEntity[]> {
    return await this.languageService.findAll();
  }

  @Get('/names')
  async allLanguageNames(): Promise<string[]> {
    return this.languageService.getLanguageName();
  }
}
