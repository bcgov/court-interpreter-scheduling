import { Test, TestingModule } from '@nestjs/testing';
import { InterpreterController } from './interpreter.controller';
import { InterpreterService } from './interpreter.service';

describe('InterpreterController', () => {
  let controller: InterpreterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterpreterController],
      providers: [InterpreterService],
    }).compile();

    controller = module.get<InterpreterController>(InterpreterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
