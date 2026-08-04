import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Observable } from 'rxjs';

@Injectable()
export class SseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Streams kitchen orders every 2 seconds via SSE.
   * Works in serverless because it polls the DB within the same invocation.
   * EventSource auto-reconnects when the 30s Vercel limit is reached.
   */
  streamKitchenOrders(): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      const poll = async () => {
        try {
          const orders = await this.prisma.order.findMany({
            where: { status: { in: ['PENDING', 'PREPARING'] } },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'asc' },
          });
          subscriber.next({
            data: JSON.stringify({ type: 'kitchen_orders', data: orders }),
          } as MessageEvent);
        } catch (err: any) {
          console.error('[SSE] poll error:', err?.message);
        }
      };

      // Send immediately on connect
      poll();

      // Then every 2 seconds
      const timer = setInterval(poll, 2000);

      return () => clearInterval(timer);
    });
  }
}
