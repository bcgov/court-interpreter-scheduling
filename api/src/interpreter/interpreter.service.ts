import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

import { BookingDateEntity } from 'src/booking/entities/booking-date.entity';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { PaginateInterpreterQueryDto } from './dto/paginate-interpreter-query.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { InterpreterEntity } from './entities/interpreter.entity';
import { InterpreterRO } from './ro/interpreter.ro';
import { BookingPeriod } from 'src/booking/enums/booking-period.enum';

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
    const { languages, ...insertInterpreter } = createInterpreterDto;
    const interpreter = this.interpreterRepository.create(insertInterpreter);
    interpreter.languages = interpreterLangs;
    return await this.interpreterRepository.save(interpreter);
  }

  async findAll(
    paginateInterpreterQueryDto: PaginateInterpreterQueryDto,
  ): Promise<SuccessResponse<InterpreterRO>> {
    const {
      page,
      limit,
      level,
      language,
      city,
      dates,
      name,
    } = paginateInterpreterQueryDto;

    const query = this.interpreterRepository
      .createQueryBuilder('interpreter')
      .leftJoinAndSelect('interpreter.languages', 'intLang')
      .leftJoinAndSelect('intLang.language', 'lang')
      .leftJoinAndSelect('interpreter.bookings', 'booking')
      .leftJoinAndSelect('booking.dates', 'dates')
      .skip((page - 1) * limit)
      .take(limit);

    if (level && level.length > 0) {
      query.where('intLang.level IN (:...level)', {
        level,
      });
    }

    if (language) {
      query.andWhere('intLang.language.name = :name', { name: language });
    }

    if (city) {
      query.andWhere('LOWER(interpreter.city) = LOWER(:city)', { city });
    }

    if (dates && dates.length > 0) {
      const metric = (date: string, time: string, period: BookingPeriod) => {
        return `MIN(SQRT(
          POWER(ABS(EXTRACT(EPOCH FROM ('${date}' - d."date"))/60),2)
        + POWER(ABS(EXTRACT(EPOCH FROM ('${time}' - d."arrival_time"))/60),2)
        + (CASE WHEN d."period" = '${period}' THEN 0
        ELSE 1
        END)
        ))
        `;
      };

      dates.forEach((date, idx) => {
        query.leftJoinAndSelect(
          subQuery => {
            return subQuery
              .select(
                metric(date.date.toISOString(), date.arrivalTime, date.period),
                `score_${idx}`,
              )
              .addSelect(`b.interpreter`, 'interpreterId')
              .from(BookingDateEntity, 'd')
              .leftJoin('d.booking', 'b')
              .groupBy('b.interpreter');
          },
          `s_${idx}`,
          `"s_${idx}"."interpreterId" = interpreter.id`,
        );
      });

      const select: string = Array.from(Array(dates.length)).reduce(
        (acc, val, idx) => {
          return `${acc}${idx > 0 ? ' + ' : ''}s_${idx}.score_${idx}`;
        },
        '',
      );
      query.addSelect(`(${select})/${dates.length}`, 'avg_score');
      query.orderBy('avg_score', 'DESC');
    }

    if (name) {
      query.andWhere(
        `LOWER(CONCAT(interpreter.firstName, ' ', interpreter.lastName)) like LOWER(:name)`,
        {
          name: `%${name}%`,
        },
      );
    }

    const interpreters = await query.getMany();

    return {
      data: interpreters.map((i: InterpreterEntity) => i.toResponseObject()),
      pagination: { page, limit },
    };
  }

  async findOne(id: number): Promise<InterpreterEntity> {
    return await this.interpreterRepository.findOneOrFail({
      relations: ['languages'],
      where: { id },
    });
  }

  async update(
    id: number,
    updateInterpreterDto: Omit<UpdateInterpreterDto, 'languages'>,
    langs?: InterpreterLanguageEntity[],
  ): Promise<void> {
    const interpreter = this.interpreterRepository.create({
      id,
      ...updateInterpreterDto,
    });

    if (langs && langs.length > 0) {
      interpreter.languages = langs;
    }

    await this.interpreterRepository.save(interpreter);
  }

  async remove(id: number): Promise<void> {
    const interpreter = await this.interpreterRepository.findOneOrFail({
      id,
    });
    await this.interpreterRepository.remove(interpreter);
  }
}
