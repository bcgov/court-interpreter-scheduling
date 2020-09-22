import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';

@Controller('interpreter')
export class InterpreterController {
  constructor(private readonly interpreterService: InterpreterService) {}
  
  @Post()
  create(@Body() createInterpreterDto: CreateInterpreterDto) {
    return this.interpreterService.create(createInterpreterDto);
  }

  @Get()
  findAll() {
    return this.interpreterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interpreterService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInterpreterDto: UpdateInterpreterDto) {
    return this.interpreterService.update(+id, updateInterpreterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interpreterService.remove(+id);
  }
}
