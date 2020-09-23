import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguageEntity } from './entities/language.entity';

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

  findOne(id: number) {
    return `This action returns a #${id} language`;
  }

  update(id: number, updateLanguageDto: UpdateLanguageDto) {
    return `This action updates a #${id} language`;
  }

  remove(id: number) {
    return `This action removes a #${id} language`;
  }
}
