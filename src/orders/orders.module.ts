import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma.module';
import { EventsModule } from '../gateway/events.module';

@Module({
  imports: [PrismaModule, EventsModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
