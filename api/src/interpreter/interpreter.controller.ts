import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';
import { InterpreterEntity } from './entities/interpreter.entity';
import { ApiTags } from '@nestjs/swagger';

import { PaginateInterpreterQueryDTO } from './dto/paginate-interpreter-query.dto';
@ApiTags('interpreter')
@Controller('interpreter')
export class InterpreterController {
  constructor(private readonly interpreterService: InterpreterService) {}

  @Post()
  async create(
    @Body() createInterpreterDto: CreateInterpreterDto,
  ): Promise<InterpreterEntity> {
    return await this.interpreterService.create(createInterpreterDto);
  }

  @Get()
  async findAll(
    @Query() paginateInterpreterQueryDTO: PaginateInterpreterQueryDTO,
  ): Promise<InterpreterEntity[]> {
    return await this.interpreterService.findAll(paginateInterpreterQueryDTO);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InterpreterEntity> {
    return await this.interpreterService.findOne(+id);
  }

  @Put(':id')
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
