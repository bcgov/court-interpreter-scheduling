import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';
import { LanguageEntity } from './entities/language.entity';
import { LanguageNameToDisplayName } from 'src/common/constant';

@Injectable()
export class LanguageService {
  constructor(
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async create(createLanguageDto: CreateLanguageDto): Promise<LanguageEntity> {
    const language = this.languageRepository.create(createLanguageDto);
    return await this.languageRepository.save(language);
  }

  async findAll(): Promise<LanguageEntity[]> {
    return await this.languageRepository.find();
  }

  async getLanguageName(): Promise<string[]> {
    return (await this.languageRepository.find())
      .map(item => LanguageNameToDisplayName.get(item.name) || item.name)
      .sort();
  }
}
