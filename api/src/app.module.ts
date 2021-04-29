import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { InterpreterModule } from './interpreter/interpreter.module';
import { LanguageModule } from './language/language.module';
import { LocationModule } from './location/location.module';
import { BookingModule } from './booking/booking.module';
import { AuthModule } from './auth/auth.module';
import { DistanceModule } from './distance/distance.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: { prettyPrint: { colorize: true, singleLine: process.env.NODE_ENV === 'production' } },
    }),
    DatabaseModule,
    InterpreterModule,
    LanguageModule,
    LocationModule,
    BookingModule,
    AuthModule,
    DistanceModule,
    EventModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
