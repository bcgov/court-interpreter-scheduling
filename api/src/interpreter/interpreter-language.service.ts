import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LanguageEntity } from 'src/language/entities/language.entity';
import { InterpreterLanguageDTO } from './dto/interpreter-language.dto';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';
import { capFirstAndSmallRest } from 'src/utils/utils';

@Injectable()
export class InterpreterLanguageService {
  constructor(
    @InjectRepository(InterpreterLanguageEntity)
    private readonly interpreterLanguageRepository: Repository<
      InterpreterLanguageEntity
    >,
    @InjectRepository(LanguageEntity)
    private readonly languageRepository: Repository<LanguageEntity>,
  ) {}

  async create(
    interpreterLanguage: Partial<InterpreterLanguageDTO>[],
  ): Promise<InterpreterLanguageEntity[]> {
    const iLangs = await Promise.all(
      interpreterLanguage.map(async (intLang: InterpreterLanguageDTO) => {
        const iLang = new InterpreterLanguageEntity();

        let language = await this.languageRepository
          .createQueryBuilder('language')
          .where('LOWER(language.name) = LOWER(:name)', {
            name: intLang.languageName,
          })
          .getOne();

        if (!language) {
          const newLang = this.languageRepository.create();
          newLang.name = capFirstAndSmallRest(intLang.languageName);
          language = await this.languageRepository.save(newLang);
        }

        iLang.language = language;
        iLang.level = intLang.level;
        iLang.commentOnLevel = intLang.commentOnLevel;
        return iLang;
      }),
    ).catch(function(err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });

    const iLangMap = await Promise.all(
      iLangs.map(async iLang => {
        return this.interpreterLanguageRepository.save(iLang);
      }),
    );
    return iLangMap;
  }

  async removeByInterpreterLangs(
    interpreterLangs: InterpreterLanguageEntity[],
  ): Promise<void> {
    await this.interpreterLanguageRepository.remove(interpreterLangs);
  }

  async createMany(
    interpreterLanguage: Partial<InterpreterLanguageDTO>[],
  ): Promise<InterpreterLanguageEntity[]> {
    const iLangs = await Promise.all(
      interpreterLanguage.map(async (intLang: InterpreterLanguageDTO) => {
        const iLang = new InterpreterLanguageEntity();

        const smallLang = capFirstAndSmallRest(intLang.languageName);

        const language = new LanguageEntity();
        language.name = smallLang;

        await this.languageRepository
          .createQueryBuilder('language')
          .insert()
          .into(LanguageEntity)
          .values(language)
          .onConflict(`("name") DO UPDATE SET "name" = :name`)
          .setParameter('name', smallLang)
          .execute();

        iLang.language = language;
        iLang.level = intLang.level;
        iLang.commentOnLevel = intLang.commentOnLevel;
        return iLang;
      }),
    ).catch(function(err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });

    const iLangMap = await Promise.all(
      iLangs.map(async iLang => {
        return this.interpreterLanguageRepository.save(iLang);
      }),
    );
    return iLangMap;
  }
}
