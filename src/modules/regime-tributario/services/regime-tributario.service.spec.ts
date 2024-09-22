import { Test, TestingModule } from '@nestjs/testing';
import { RegimeTributarioService } from './regime-tributario.service';

describe('RegimeTributarioService', () => {
  let service: RegimeTributarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegimeTributarioService],
    }).compile();

    service = module.get<RegimeTributarioService>(RegimeTributarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
