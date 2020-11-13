import { PartialType } from '@nestjs/swagger';
import { CreateInterpreterDto } from './create-interpreter.dto';

export class UpdateInterpreterDto extends PartialType(CreateInterpreterDto) {}
