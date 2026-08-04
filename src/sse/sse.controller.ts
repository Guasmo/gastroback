import { Controller, Sse, MessageEvent, Res, Header } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SseService } from './sse.service';

@Controller('events')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  /**
   * SSE endpoint for the kitchen/TV screen.
   * Connect with: const es = new EventSource('https://gastroback.vercel.app/events/kitchen');
   * es.addEventListener('kitchen_orders', e => { const data = JSON.parse(e.data); ... });
   */
  @Sse('kitchen')
  @Header('Cache-Control', 'no-cache')
  @Header('X-Accel-Buffering', 'no')
  streamKitchen(): Observable<MessageEvent> {
    return this.sseService.streamKitchenOrders();
  }
}
