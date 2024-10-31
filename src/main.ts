import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupBullBoard } from './bull-board.setup';
import { getQueueToken } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Obtenha a fila do BullMQ para passar para o Bull Board
  const queue_extract = app.get<Queue>(getQueueToken('extract'));
  const queue_load = app.get<Queue>(getQueueToken('load'));
  const queue_transform = app.get<Queue>(getQueueToken('transform'));

  // Setup do Bull Board
  setupBullBoard([queue_extract,queue_transform,queue_load]);

  await app.listen(3000);
}
bootstrap();
