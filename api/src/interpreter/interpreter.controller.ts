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
} from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterEntity } from './entities/interpreter.entity';
import { InterpreterRO } from './ro/interpreter.ro';
import { ApiTags } from '@nestjs/swagger';

import { PaginateInterpreterQueryDto } from './dto/paginate-interpreter-query.dto';

import { InterpreterLanguageService } from './interpreter-language.service';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
import { anonymiseObject, ValueType } from 'src/utils/anonymisation';
import { FileInterceptor } from '@nestjs/platform-express';
import * as csvtojson from 'csvtojson';
import { mappingDirectories } from 'src/utils';
import { FileUploadInterpreterDto } from './dto/file-upload-interpreter.dto';
import { DistanceService } from 'src/distance/distance.service';

const KEYS_TO_ANONYMISE: Partial<Record<keyof CreateInterpreterDto, ValueType>> = {
  // address: 'address',
  firstName: 'firstName',
  lastName: 'lastName',
  // city: 'city',
  email: 'email',
  emailAlt: 'email',
  phone: 'phone',
  // postal: 'postalCode',
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
  ) {}

  @Post()
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
  async findAll(
    @Query() paginateInterpreterQueryDto: PaginateInterpreterQueryDto,
  ): Promise<SuccessResponse<InterpreterRO>> {
    return await this.interpreterService.findAll(paginateInterpreterQueryDto);
  }

  @Post('search')
  @HttpCode(200)
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
  async findOne(@Param('id') id: string): Promise<InterpreterEntity> {
    // TODO ask if this should not use `toResponseObject()`
    return await this.interpreterService.findOne(+id);
  }

  @Patch(':id')
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
    await this.interpreterService.update(+id, updateDto, langs);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.interpreterService.remove(+id);
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadInterpreterDto: FileUploadInterpreterDto,
  ) {
    try {
      /**
       * check if it's correct file type
       */
      if (file.mimetype !== 'text/csv') {
        throw new Error('file type not correct');
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
        ];
      }

      /**
       * convert csv to json
       */
      let json = await csvtojson({
        noheader: false,
        headers,
      }).fromString(file.buffer.toString());

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
      const uploadedDirectories = await this.uploadDirectoriesToDatabase(directories);

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
}
