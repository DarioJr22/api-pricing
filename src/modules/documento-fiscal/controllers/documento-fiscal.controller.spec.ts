import { Test, TestingModule } from '@nestjs/testing';
import { DocumentoFiscalController } from './documento-fiscal.controller';

describe('DocumentoFiscalController', () => {
  let controller: DocumentoFiscalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentoFiscalController],
    }).compile();

    controller = module.get<DocumentoFiscalController>(DocumentoFiscalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
