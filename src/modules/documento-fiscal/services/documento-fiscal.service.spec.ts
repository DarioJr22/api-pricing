import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoFiscalService } from './documento-fiscal.service';

describe('DocumentoFiscalService', () => {
  let service: DocumentoFiscalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentoFiscalService],
    }).compile();

    service = module.get<DocumentoFiscalService>(DocumentoFiscalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
