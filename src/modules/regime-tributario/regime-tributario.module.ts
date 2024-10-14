import { Module } from '@nestjs/common';
import { RegimeTributarioController } from './controllers/regime-tributario.controller';
import { RegimeTributarioService } from './services/regime-tributario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegimeTributario } from './entities/regime-tributario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([RegimeTributario])],
  controllers: [RegimeTributarioController],
  providers: [RegimeTributarioService]
})
export class RegimeTributarioModule {}
