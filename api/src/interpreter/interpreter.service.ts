import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format, sub, parse } from 'date-fns';
import { Repository } from 'typeorm';

import { BookingDateEntity } from 'src/booking/entities/booking-date.entity';
import { BookingPeriod } from 'src/booking/enums/booking-period.enum';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { PaginateInterpreterQueryDto } from './dto/paginate-interpreter-query.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { InterpreterEntity } from './entities/interpreter.entity';
import { InterpreterRO } from './ro/interpreter.ro';
import * as ExcelJS from 'exceljs';
import * as path from 'path';
import { setCellHelper } from 'src/utils';

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
    if (createInterpreterDto.criminalRecordCheck && !createInterpreterDto.criminalRecordCheckDate) {
      try {
        const dateObj = parse(createInterpreterDto.criminalRecordCheck, 'dd-MMM-yy', new Date());
        if (dateObj.toString() !== 'Invalid Date') {
          createInterpreterDto.criminalRecordCheckDate = format(dateObj, 'yyyy-MM-dd');
        }
      } catch (ex) {
        Logger.debug(`No date entry in [criminalRecordCheck]`);
      }
    }
    const { languages, ...insertInterpreter } = createInterpreterDto;

    const interpreter = this.interpreterRepository.create(insertInterpreter);
    interpreter.languages = interpreterLangs;

    return await this.interpreterRepository.save(interpreter);
  }

  async findAll(paginateInterpreterQueryDto: PaginateInterpreterQueryDto): Promise<SuccessResponse<InterpreterRO>> {
    const { page, limit, dates, keywords, language, criminalRecordCheck, courtAddr } = paginateInterpreterQueryDto;

    let query = this.interpreterRepository
      .createQueryBuilder('interpreter')
      .leftJoinAndSelect('interpreter.languages', 'intLang')
      .leftJoinAndSelect('intLang.language', 'lang')
      .leftJoinAndSelect('interpreter.bookings', 'booking')
      .leftJoinAndSelect('interpreter.events', 'event', `event.createdAt > :thirtyDaysAgo`, {
        thirtyDaysAgo: format(sub(new Date(), { days: 30 }), 'yyyy-MM-dd'),
      })
      .leftJoinAndSelect('booking.dates', 'dates')
      .orderBy('interpreter.lastName', 'ASC');

    query = paginateInterpreterQueryDto.filter(query);

    if (language) {
      query
        .leftJoinAndSelect('interpreter.languages', 'int_languages')
        .leftJoinAndSelect('int_languages.language', 'languages_lang');
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
              .select(metric(date.date.toISOString(), date.arrivalTime, date.period), `score_${idx}`)
              .addSelect(`b.interpreter`, 'interpreterId')
              .from(BookingDateEntity, 'd')
              .leftJoin('d.booking', 'b')
              .groupBy('b.interpreter');
          },
          `s_${idx}`,
          `"s_${idx}"."interpreterId" = interpreter.id`,
        );
      });

      const select: string = Array.from(Array(dates.length))
        .map((date, idx) => `s_${idx}.score_${idx}`)
        .join(' + ');

      query.addSelect(`(${select})/${dates.length}`, 'avg_score');
      query.addOrderBy('avg_score', 'DESC');
    }

    if (keywords) {
      /**
       * return interpreter.address, ' ' , interpreter.city, ' ' , interpreter.province
       */
      const searchColumns = InterpreterEntity.getSearchColums()
        .map(column => `interpreter.${column}`)
        .join(`, ' ', `);

      query.andWhere(`LOWER(CONCAT(${searchColumns})) like LOWER(:keywords)`, {
        keywords: `%${keywords}%`,
      });
    }

    if (criminalRecordCheck) {
      query.andWhere(
        `interpreter.criminalRecordCheckDate < TO_TIMESTAMP(:criminalRecordCheckDate, 'YYYY-MM-DD') - interval '5 year'`,
        {
          criminalRecordCheckDate: format(criminalRecordCheck, 'yyyy-MM-dd'),
        },
      );
    }

    // order on court addr
    if (courtAddr) {
      query.addSelect(
        `CONCAT(interpreter.address, ', ', interpreter.city, ', ', interpreter.province, ' ', interpreter.postal)`,
        'interpreter_intpAddr',
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

  /**
   * empty table
   */
  async emptyTable(): Promise<void> {
    await this.interpreterRepository.query(`DELETE FROM ${InterpreterEntity.tableName};`);

    // maybe in the future, we can enable this set auto-increment index to 1
    // await this.interpreterRepository.query(`ALTER SEQUENCE ${InterpreterEntity.tableName}_id_seq RESTART WITH 1`);
  }

  async findAllAddress(): Promise<{ address: string }[]> {
    return await this.interpreterRepository.query(`
    SELECT DISTINCT(CONCAT(address, ', ', city, ', ', province, ' ', postal)) AS address
      FROM "interpreter"
      WHERE address IS NOT NULL
    `);
  }

  async exportToWorkbook(): Promise<ExcelJS.Workbook> {
    // Create workbook
    const workbook = new ExcelJS.Workbook();
    // Read template
    await workbook.xlsx.readFile(path.join(__dirname, '..', '..', '/assets/Template_AllLanguages.xlsx'));

    const worksheet = workbook.getWorksheet('Export');
    if (!worksheet) {
      throw new InternalServerErrorException('Unable to load template file to export data');
    }
    const setCell = setCellHelper(worksheet);

    const interpreters: InterpreterEntity[] = await this.interpreterRepository.find();

    let cellRowIndex = 2;
    const updateCell = (
      interpreter: InterpreterEntity,
      languageRel: InterpreterLanguageEntity,
      cellRowIndex: number,
    ) => {
      // Level
      setCell({ row: cellRowIndex, column: 'A', value: `${languageRel.level}` });
      // Language
      setCell({ row: cellRowIndex, column: 'C', value: languageRel.language.name });

      // Last name
      setCell({ row: cellRowIndex, column: 'D', value: interpreter.lastName });

      // First name
      setCell({ row: cellRowIndex, column: 'E', value: interpreter.firstName });

      // Address
      setCell({ row: cellRowIndex, column: 'F', value: interpreter.address });

      // City
      setCell({ row: cellRowIndex, column: 'G', value: interpreter.city });

      // Province
      setCell({ row: cellRowIndex, column: 'H', value: interpreter.province });

      // Postal Code
      setCell({ row: cellRowIndex, column: 'I', value: interpreter.postal });

      // Home Phone
      setCell({ row: cellRowIndex, column: 'J', value: interpreter.homePhone });

      // Business Phone
      setCell({ row: cellRowIndex, column: 'K', value: interpreter.businessPhone });

      // Cell phone
      setCell({ row: cellRowIndex, column: 'L', value: interpreter.phone });

      // Email address
      setCell({ row: cellRowIndex, column: 'M', value: interpreter.email });

      // Supplier
      setCell({ row: cellRowIndex, column: 'N', value: interpreter.supplier });

      // GST
      setCell({ row: cellRowIndex, column: 'O', value: interpreter.gst });

      // Comment
      setCell({ row: cellRowIndex, column: 'Q', value: interpreter.comments });

      // Admin Comments
      setCell({ row: cellRowIndex, column: 'R', value: interpreter.adminComments });

      // Active
      setCell({ row: cellRowIndex, column: 'S', value: `${interpreter.contractExtension}` });
    };
    for (const interpreter of interpreters) {
      if (interpreter.languages && interpreter.languages.length > 1) {
        for (const lang of interpreter.languages) {
          updateCell(interpreter, lang, cellRowIndex);
          cellRowIndex++;
        }
      } else {
        updateCell(interpreter, interpreter.languages[0], cellRowIndex);
        cellRowIndex++;
      }
    }

    return workbook;
  }
}
