import { Test, TestingModule } from '@nestjs/testing';
import { OmieService } from './omie.service';

describe('OmieService', () => {
  let service: OmieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OmieService],
    }).compile();

    service = module.get<OmieService>(OmieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
