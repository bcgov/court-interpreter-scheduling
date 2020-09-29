import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LanguageEntity } from 'src/language/entities/language.entity';
import { InterpreterLanguageDTO } from './dto/interpreter-language.dto';
import { InterpreterLanguageEntity } from './entities/interpreter-language.entity';

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
        const language = await this.languageRepository.findOneOrFail({
          name: intLang.languageName,
        });

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
