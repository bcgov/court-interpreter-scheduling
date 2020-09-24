import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { InterpreterModule } from './interpreter/interpreter.module';
import { LanguageModule } from './language/language.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, InterpreterModule, LanguageModule, LocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
