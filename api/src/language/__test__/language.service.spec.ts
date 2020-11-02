import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateLanguageDto } from '../dto/create-language.dto';
import { LanguageEntity } from '../entities/language.entity';
import { LanguageService } from '../language.service';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  create: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
});
describe('LanguageService', () => {
  let service: LanguageService;
  let languageRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageService,
        { provide: Connection, useValue: {} },
        {
          provide: getRepositoryToken(LanguageEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();
    service = module.get<LanguageService>(LanguageService);
    languageRepository = module.get<MockRepository>(
      getRepositoryToken(LanguageEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all languages', async () => {
      const expectedLanguages = [{ name: 'French' }];

      languageRepository.find.mockReturnValue(expectedLanguages);
      const languages = await service.findAll();
      expect(languages).toEqual(expectedLanguages);
    });
  });

  describe('create', () => {
    it('should create a language', async () => {
      const expectedLanguage = { name: 'French' };

      const langDto = new CreateLanguageDto();
      langDto.name = 'French';

      languageRepository.create.mockReturnValue(expectedLanguage);
      languageRepository.save.mockReturnValue(expectedLanguage);
      const language = await service.create(langDto);
      expect(language).toEqual(expectedLanguage);
    });
  });
});
