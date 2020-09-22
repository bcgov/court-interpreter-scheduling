import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forRoot()],
  providers: [DatabaseService],
})
export class DatabaseModule {}
