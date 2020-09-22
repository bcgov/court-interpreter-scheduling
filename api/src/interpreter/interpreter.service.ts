import { Injectable } from '@nestjs/common';
import { CreateInterpreterDto } from './dto/create-interpreter.dto';
import { UpdateInterpreterDto } from './dto/update-interpreter.dto';

@Injectable()
export class InterpreterService {
  create(createInterpreterDto: CreateInterpreterDto) {
    return 'This action adds a new interpreter';
  }

  findAll() {
    return `This action returns all interpreter`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interpreter`;
  }

  update(id: number, updateInterpreterDto: UpdateInterpreterDto) {
    return `This action updates a #${id} interpreter`;
  }

  remove(id: number) {
    return `This action removes a #${id} interpreter`;
  }
}
