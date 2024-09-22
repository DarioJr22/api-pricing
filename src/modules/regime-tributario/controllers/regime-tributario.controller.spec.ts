import { Test, TestingModule } from '@nestjs/testing';
import { RegimeTributarioController } from './regime-tributario.controller';

describe('RegimeTributarioController', () => {
  let controller: RegimeTributarioController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegimeTributarioController],
    }).compile();

    controller = module.get<RegimeTributarioController>(RegimeTributarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
