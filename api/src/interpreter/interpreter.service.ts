import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { In, Repository } from 'typeorm';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { PaginateInterpreterQueryDTO } from './dto/paginate-interpreter-query.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterEntity } from './entities/interpreter.entity';
import { Level } from './enums/level.enum';

@Injectable()
export class InterpreterService {
  constructor(
    @InjectRepository(InterpreterEntity)
    private readonly interpreterRepository: Repository<InterpreterEntity>,
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async create(
    createInterpreterDto: Partial<CreateInterpreterDto>,
  ): Promise<InterpreterEntity> {
    const interpreter = this.interpreterRepository.create(createInterpreterDto);
    let language: LanguageEntity;
    if (createInterpreterDto && createInterpreterDto.language) {
      language = await this.languageRepository.findOne({
        id: createInterpreterDto.language,
      });
      interpreter.language = language;
    }

    await this.interpreterRepository.save(interpreter);
    return interpreter;
  }

  async findAll(
    paginateInterpreterQueryDTO: PaginateInterpreterQueryDTO,
  ): Promise<InterpreterEntity[]> {
    const { page, limit, level, ...where } = paginateInterpreterQueryDTO;

    const data = await this.interpreterRepository.find({
      where: {
        level: level ? In(level) : In([1, 2, 3, 4]),
        ...where,
      },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['language'],
    });
    return data;
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
