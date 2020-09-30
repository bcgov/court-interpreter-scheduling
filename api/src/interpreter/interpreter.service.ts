import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { Repository } from 'typeorm';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { PaginateInterpreterQueryDTO } from './dto/paginate-interpreter-query.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { InterpreterEntity } from './entities/interpreter.entity';

@Injectable()
export class InterpreterService {
  constructor(
    @InjectRepository(InterpreterEntity)
    private readonly interpreterRepository: Repository<InterpreterEntity>,
  ) {}

  async create(
    createInterpreterDto: Partial<CreateInterpreterDto>,
    interpreterLangs: InterpreterLanguageEntity[],
  ): Promise<InterpreterEntity> {
    const { language, ...insertInterpreter } = createInterpreterDto;
    const interpreter = this.interpreterRepository.create(insertInterpreter);
    interpreter.language = interpreterLangs;
    return await this.interpreterRepository.save(interpreter);
  }

  async findAll(
    paginateInterpreterQueryDTO: PaginateInterpreterQueryDTO,
  ): Promise<SuccessResponse<InterpreterEntity>> {
    const { page, limit, level, language, city } = paginateInterpreterQueryDTO;

    const query = this.interpreterRepository
      .createQueryBuilder('interpreter')
      .leftJoinAndSelect('interpreter.language', 'intLang')
      .leftJoinAndSelect('intLang.language', 'lang')
      .offset((page - 1) * limit)
      .limit(limit);

    if (level && level.length > 0) {
      query.where('intLang.level IN (:...level)', {
        level,
      });
    }
    if (language) {
      query.andWhere('intLang.language.name = :name', { name: language });
    }

    if (city) {
      query.andWhere('interpreter.city = :city', { city });
    }

    const interpreters = await query.getMany();

    return {
      data: interpreters,
      pagination: { page, limit },
    };
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
