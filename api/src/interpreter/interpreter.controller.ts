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
} from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterEntity } from './entities/interpreter.entity';
import { ApiTags } from '@nestjs/swagger';

import { PaginateInterpreterQueryDTO } from './dto/paginate-interpreter-query.dto';
import { InterpreterLanguageService } from './interpreter-language.service';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { SuccessResponse } from 'src/common/interface/response/success.interface';
@ApiTags('interpreter')
@Controller('interpreter')
export class InterpreterController {
  constructor(
    private readonly interpreterService: InterpreterService,
    private readonly interpreterLanguageService: InterpreterLanguageService,
  ) {}

  @Post()
  async create(
    @Body() createInterpreterDto: CreateInterpreterDto,
  ): Promise<InterpreterEntity> {
    let interpreterLangs: InterpreterLanguageEntity[] = [];

    const { language } = createInterpreterDto;

    if (language && language.length > 0) {
      try {
        interpreterLangs = await this.interpreterLanguageService.create(
          language,
        );
      } catch (err) {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      }
    }

    return this.interpreterService.create(
      createInterpreterDto,
      interpreterLangs,
    );
  }

  @Get()
  async findAll(
    @Query() paginateInterpreterQueryDTO: PaginateInterpreterQueryDTO,
  ): Promise<SuccessResponse<InterpreterEntity>> {
    return await this.interpreterService.findAll(paginateInterpreterQueryDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InterpreterEntity> {
    return await this.interpreterService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInterpreterDto: UpdateInterpreterDto,
  ): Promise<void> {
    await this.interpreterService.update(+id, updateInterpreterDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.interpreterService.remove(+id);
  }
}
