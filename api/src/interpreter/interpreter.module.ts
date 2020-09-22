import { Module } from '@nestjs/common';
import { InterpreterService } from './interpreter.service';
import { InterpreterController } from './interpreter.controller';

@Module({
  controllers: [InterpreterController],
  providers: [InterpreterService]
})
export class InterpreterModule {}
