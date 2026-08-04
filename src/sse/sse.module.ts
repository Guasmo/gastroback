import { Module } from '@nestjs/common';
import { SseController } from './sse.controller';
import { SseService } from './sse.service';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
