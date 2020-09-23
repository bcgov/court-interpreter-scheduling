import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { Repository } from 'typeorm';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterEntity } from './entities/interpreter.entity';

@Injectable()
export class InterpreterService {
  constructor(
    @InjectRepository(InterpreterEntity)
    private readonly interpreterRepository: Repository<InterpreterEntity>,
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async create(
    createInterpreterDto: CreateInterpreterDto,
  ): Promise<InterpreterEntity> {
    const interpreter = new InterpreterEntity();
    interpreter.name = createInterpreterDto.name;
    let language: LanguageEntity;
    if (createInterpreterDto.language) {
      language = await this.languageRepository.findOne({
        id: createInterpreterDto.language,
      });
      interpreter.language = language;
    }

    await this.interpreterRepository.save(interpreter);
    return interpreter;
  }

  async findAll(): Promise<InterpreterEntity[]> {
    return await this.interpreterRepository.find({ relations: ['language'] });
  }

  async findOne(id: number): Promise<InterpreterEntity> {
    return await this.interpreterRepository.findOneOrFail({ id });
  }

  async update(
    id: number,
    updateInterpreterDto: UpdateInterpreterDto,
  ): Promise<void> {
    await this.interpreterRepository.update(id, updateInterpreterDto);
  }

  async remove(id: number): Promise<void> {
    const interpreter = await this.interpreterRepository.findOneOrFail({
      id,
    });
    await this.interpreterRepository.remove(interpreter);
  }
}
