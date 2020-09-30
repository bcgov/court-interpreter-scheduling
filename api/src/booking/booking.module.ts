import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageEntity } from 'src/language/entities/language.entity';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { InterpreterService } from 'src/interpreter/interpreter.service';
import { InterpreterModule } from 'src/interpreter/interpreter.module';
import { BookingEntity } from './entities/booking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LanguageEntity,
      InterpreterEntity,
      BookingEntity,
    ]),
    InterpreterModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
