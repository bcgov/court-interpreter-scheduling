import { PartialType } from '@nestjs/mapped-types';
import { CreateInterpreterDto } from './create-interpreter.dto';

export class UpdateInterpreterDto extends PartialType(CreateInterpreterDto) {}
