import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InterpreterEventEntity } from 'src/event/entities/interpreter-event.entity';
import { BookingEventEntity } from 'src/event/entities/booking-event.entity';

import { BookingEntity } from 'src/booking/entities/booking.entity';
import { UpdateBookingDto } from 'src/booking/dto/update-booking.dto';
import { InterpreterEntity } from 'src/interpreter/entities/interpreter.entity';
import { InterpreterLanguageEntity } from 'src/interpreter/entities/interpreter-language.entity';
import { UpdateInterpreterDto } from 'src/interpreter/dto/update-interpreter.dto';
import { InterpreterLanguageDTO } from 'src/interpreter/dto/interpreter-language.dto';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(InterpreterEventEntity)
    private readonly interpreterEventRepository: Repository<InterpreterEventEntity>,
    @InjectRepository(BookingEventEntity)
    private readonly bookingEventRepository: Repository<BookingEventEntity>,
  ) {}

  async createInterpreterEvent({ interpreter, field, previous, updated }) {
    const e = this.interpreterEventRepository.create({
      field,
      previous,
      updated,
      interpreter,
    });
    return await this.interpreterEventRepository.save(e);
  }

  async createBookingEvent({ booking, user, field, previous, updated}) {
    const e = this.bookingEventRepository.create({
      field,
      previous,
      updated,
      booking,
      user,
    });
    return await this.bookingEventRepository.save(e);
  }

  async parseInterpreterUpdate(
    original: InterpreterEntity,
    updateDto: UpdateInterpreterDto,
    languages: InterpreterLanguageEntity[],
    updatedLanguages: InterpreterLanguageDTO[],
  ) {

    const updates = [];
    for (const k in original) {
      if (original[k] !== updateDto[k] && updateDto[k]) {
        updates.push({
          field: k,
          previous: original[k],
          updated: updateDto[k],
        })
      }
    }
    try {
      await languages.map((language: InterpreterLanguageEntity) => {
        const updateEntry = updatedLanguages.find(lang => lang.languageName === language.language.name)
        if (!updateEntry) {
          const previous = languages.find(lang => updatedLanguages.every(l => l.languageName !== lang.language.name))
          const updated = updatedLanguages.find(lang => languages.every(l => l.language.name !== lang.languageName))
          updates.push({
            field: 'language',
            subfield: 'name',
            previous: previous.language.name,
            updated: updated.languageName,
            language: updated.languageName,
          });

          for (const field in language) {
            if (['level', 'commentOnLevel'].includes(field)) {
              if (language[field] !== updated[field]) {
                updates.push({
                  field: 'language',
                  subfield: field,
                  previous: language[field],
                  updated: updateEntry[field],
                  language: language.language.name,
                });
              };
            };
          };
          return;
        }

        for (const field in language) {
          if (['level', 'commentOnLevel'].includes(field)) {
            if (language[field] !== updateEntry[field]) {
              updates.push({
                // bit of a hack, use the field string to determine both the lang and the field
                field: `${language.language.name}.${field}`,
                previous: language[field],
                updated: updateEntry[field],
              })
            }
          }
        }
        return;
      })
    } catch (error) {
      console.error(error);
    } finally {
      return updates;
    }
  }

  async parseBookingUpdate(original: BookingEntity, updateDto: UpdateBookingDto) {
    const updates = [];
    for (const k in original) {
      if (original[k] !== updateDto[k] && updateDto[k]) {
        updates.push({
          field: k,
          previous: original[k],
          updated: updateDto[k],
        })
      }
    }
    return updates;
  }
}
