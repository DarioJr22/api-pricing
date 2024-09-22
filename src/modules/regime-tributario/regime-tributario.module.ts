import { Module } from '@nestjs/common';
import { RegimeTributarioController } from './controllers/regime-tributario.controller';
import { RegimeTributarioService } from './services/regime-tributario.service';

@Module({
  controllers: [RegimeTributarioController],
  providers: [RegimeTributarioService]
})
export class RegimeTributarioModule {}
