import { Test, TestingModule } from '@nestjs/testing';
import { CreateLanguageDto } from '../dto/create-language.dto';
import { LanguageEntity } from '../entities/language.entity';
import { LanguageController } from '../language.controller';
import { LanguageService } from '../language.service';

const testLang = new LanguageEntity();
const French = 'French';
testLang.name = French;

const testDto = new CreateLanguageDto();
testDto.name = French;

describe('Language Controller', () => {
  let controller: LanguageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageController],
      providers: [
        {
          provide: LanguageService,
          useValue: {
            findAll: jest.fn().mockReturnValue([testLang]),
            create: jest.fn().mockReturnValue(testLang),
          },
        },
      ],
    }).compile();

    controller = module.get<LanguageController>(LanguageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get all languages', () => {
    it('should get the list of language', async () => {
      const languages = await controller.findAll();

      expect(typeof languages).toBe('object');
      expect(languages[0].name).toBe(French);
      expect(languages.length).toBe(1);
    });
  });

  describe('create a language', () => {
    it('should create a language', async () => {
      const language = await controller.create(testDto);
      expect(language).toEqual(testLang);
      expect(language.name).toBe(French);
    });
  });
});
