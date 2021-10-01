import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  UploadedFile,
  Logger,
  Header,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';

import { InterpreterService } from './interpreter.service';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterEntity } from './entities/interpreter.entity';
import { InterpreterRO } from './ro/interpreter.ro';

import { PaginateInterpreterQueryDto } from './dto/paginate-interpreter-query.dto';
import { UpdateObject } from 'src/common/interface/UpdateObject.interface';

import { InterpreterLanguageService } from './interpreter-language.service';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { anonymiseObject, ValueType } from 'src/utils/anonymisation';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csvtojson from 'csvtojson';
import { mappingDirectories } from 'src/utils';
import { FileUploadInterpreterDto } from './dto/file-upload-interpreter.dto';
import { DistanceService } from 'src/distance/distance.service';
import { EventService } from 'src/event/event.service';
import { RoleMatchingMode, Roles } from 'nest-keycloak-connect';

const KEYS_TO_ANONYMISE: Partial<Record<keyof CreateInterpreterDto, ValueType>> = {
  address: 'address',
  firstName: 'firstName',
  lastName: 'lastName',
  city: 'city',
  email: 'email',
  emailAlt: 'email',
  phone: 'phone',
  postal: 'postalCode',
  homePhone: 'phone',
  businessPhone: 'phone',
};

@ApiTags('interpreter')
@Controller('interpreter')
export class InterpreterController {
  constructor(
    private readonly interpreterService: InterpreterService,
    private readonly interpreterLanguageService: InterpreterLanguageService,
    private readonly distanceService: DistanceService,
    private readonly eventService: EventService,
    @InjectPinoLogger(InterpreterController.name) private readonly logger: PinoLogger,
  ) {}

  @Post()
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async create(@Body() createInterpreterDto: CreateInterpreterDto): Promise<InterpreterRO> {
    let interpreterLangs: InterpreterLanguageEntity[] = [];

    const { languages } = createInterpreterDto;

    if (languages && languages.length > 0) {
      try {
        interpreterLangs = await this.interpreterLanguageService.create(languages);
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }

    const interpreter = await this.interpreterService.create(createInterpreterDto, interpreterLangs);

    return interpreter.toResponseObject();
  }

  @Post('/upload')
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async upload(
    @Body() createInterpreterDtos: CreateInterpreterDto[],
    @Query() { anonymise }: { anonymise?: boolean },
  ): Promise<InterpreterRO[]> {
    const anonymised =
      anonymise || false
        ? createInterpreterDtos.map(dto => anonymiseObject(dto, KEYS_TO_ANONYMISE))
        : createInterpreterDtos;

    return this.uploadDirectoriesToDatabase(anonymised);
  }

  @Get()
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async findAll(
    @Query() paginateInterpreterQueryDto: PaginateInterpreterQueryDto,
  ): Promise<SuccessResponse<InterpreterRO>> {
    return await this.interpreterService.findAll(paginateInterpreterQueryDto);
  }

  @Get('/file-export')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  @Header('Content-Disposition', 'attachment; filename=interpreter.xlsx')
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async export(@Res() resp: Response) {
    const workbook = await this.interpreterService.exportToWorkbook();

    return await workbook.xlsx.write(resp);
  }

  @Post('search')
  @HttpCode(200)
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async search(
    @Body() paginateInterpreterQueryDTO: PaginateInterpreterQueryDto,
  ): Promise<SuccessResponse<InterpreterRO>> {
    const interpreters = await this.interpreterService.findAll(paginateInterpreterQueryDTO);
    const { courtAddr, distanceLimit } = paginateInterpreterQueryDTO;
    if (courtAddr) {
      const { data } = interpreters;
      const newIntps = await this.distanceService.addDistanceToInterpreters(
        data as InterpreterRO[],
        courtAddr,
        distanceLimit,
      );
      interpreters.data = newIntps;
    }

    return interpreters;
  }

  @Get(':id')
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async findOne(@Param('id') id: string): Promise<InterpreterEntity> {
    // TODO ask if this should not use `toResponseObject()`
    return await this.interpreterService.findOne(+id);
  }

  @Patch(':id')
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async update(@Param('id') id: string, @Body() updateInterpreterDto: UpdateInterpreterDto): Promise<void> {
    const { languages, ...updateDto } = updateInterpreterDto;
    const interpreter = await this.interpreterService.findOne(+id);
    const originLangs = interpreter.languages;

    let langs: InterpreterLanguageEntity[];

    if (languages && languages.length > 0) {
      try {
        langs = await this.interpreterLanguageService.create(languages);
        await this.interpreterLanguageService.removeByInterpreterLangs(originLangs);
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }

    try {
      const updatedFields = await this.eventService.parseInterpreterUpdate(
        interpreter,
        updateDto,
        originLangs,
        languages,
      );
      updatedFields.map((update: UpdateObject) => this.eventService.createInterpreterEvent({ interpreter, ...update }));
    } catch (error) {
      Logger.log(`Failed to create update events: ${error.message}`);
    } finally {
      await this.interpreterService.update(+id, updateDto, langs);
    }
  }

  @Delete(':id')
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async remove(@Param('id') id: string): Promise<void> {
    await this.interpreterService.remove(+id);
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  @Roles({ roles: ['realm:cis-admin', 'realm:cis-user'], mode: RoleMatchingMode.ANY })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadInterpreterDto: FileUploadInterpreterDto,
  ) {
    try {
      /**
       * check if it's correct file type
       */
      if (file.mimetype !== 'text/csv') {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'file type not correct' },
          HttpStatus.BAD_REQUEST,
        );
      }

      /**
       * check if it's visual
       */
      let headers = [
        // the order of csv file must be consistent as sample file
        'languages.0.level',
        'languages.0.commentOnLevel',
        'languages.0.languageName',
        'lastName',
        'firstName',
        'address',
        'city',
        'province',
        'postal',
        'homePhone',
        'businessPhone',
        'phone',
        'email',
        'supplier',
        'gst',
        'criminalRecordCheck',
        'comments',
        'adminComments',
        'contractExtension',
        'siteCode',
      ];
      if (fileUploadInterpreterDto.isVisual) {
        headers = [
          'languages.0.level',
          'languages.0.commentOnLevel',
          'languages.0.languageName',
          'supplier',
          'gst',
          'lastName',
          'firstName',
          'address',
          'city',
          'postal',
          'homePhone',
          'businessPhone',
          'phone',
          'fax',
          'email',
          'criminalRecordCheck',
          'comments',
          'adminComments',
          'contractExtension',
          'siteCode',
        ];
      }

      /**
       * convert csv to json
       */
      let json = await csvtojson({
        noheader: false,
        headers,
        colParser: { siteCode: 'string' },
      }).fromString(file.buffer.toString());
      this.logger.info(json, 'json');

      /**
       * mapping function to organize the dirty row json data
       */
      let directories = mappingDirectories(json);

      /**
       * before insert to database: check othter parameters
       */
      if (fileUploadInterpreterDto.isEmptyTable) {
        await this.interpreterService.emptyTable();
      }
      if (fileUploadInterpreterDto.isAnonymous) {
        directories = directories.map(dto => anonymiseObject(dto, KEYS_TO_ANONYMISE));
      }

      /**
       * insert json to database
       */
      let uploadedDirectories: InterpreterRO[] = [];
      if (fileUploadInterpreterDto.isUpdate) {
        uploadedDirectories = await this.upsertDirectoriesToDatabase(directories);
      } else {
        uploadedDirectories = await this.uploadDirectoriesToDatabase(directories);
      }

      /**
       * return detail info
       */
      return {
        num: uploadedDirectories.length,
        uploadedDirectories,
        fileUploadInterpreterDto,
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * insert json to database
   *
   * @param directories
   * @returns
   */
  private async uploadDirectoriesToDatabase(directories: CreateInterpreterDto[]) {
    return Promise.all(
      directories.map(async (createInterpreterDto: CreateInterpreterDto) => {
        let interpreterLangs: InterpreterLanguageEntity[] = [];

        const { languages } = createInterpreterDto;

        if (languages && languages.length > 0) {
          try {
            interpreterLangs = await this.interpreterLanguageService.createMany(languages);
          } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          }
        }

        const interpreter = await this.interpreterService.create(createInterpreterDto, interpreterLangs);

        return interpreter.toResponseObject();
      }),
    );
  }

  /**
   * update json to database
   * assume field "supplier" is unique
   * @param directories
   * @returns
   */
  private async upsertDirectoriesToDatabase(directories: CreateInterpreterDto[]) {
    return Promise.all(
      directories.map(async (createInterpreterDto: CreateInterpreterDto) => {
        // langs
        let interpreterLangs: InterpreterLanguageEntity[] = [];
        const { languages, ...updateInterpreterDto } = createInterpreterDto;
        if (languages && languages.length > 0) {
          try {
            interpreterLangs = await this.interpreterLanguageService.createMany(languages);
          } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
          }
        }

        let interpreter: InterpreterEntity = null;
        let existInterpreter: InterpreterEntity = null;

        if (createInterpreterDto.supplier) {
          existInterpreter = await this.interpreterService.findOneByKey('supplier', createInterpreterDto.supplier);
        } else if (createInterpreterDto.email) {
          this.logger.info(createInterpreterDto, 'find user by email');
          existInterpreter = await this.interpreterService.findOneByKey('email', createInterpreterDto.email);
        } else {
          this.logger.info(createInterpreterDto, 'has no identity to find the interpreter, return null');
          return null;
        }

        if (existInterpreter) {
          // update exists interpreter
          interpreter = await this.interpreterService.update(
            existInterpreter.id,
            updateInterpreterDto,
            interpreterLangs,
          );
          this.logger.info(existInterpreter, 'exist interpreter');
          this.logger.info(interpreter, 'updated interpreter');
        } else {
          // insert new interpreter
          interpreter = await this.interpreterService.create(createInterpreterDto, interpreterLangs);
          this.logger.info(interpreter, 'new interpreter');
        }

        return interpreter.toResponseObject();
      }),
    );
  }
}
