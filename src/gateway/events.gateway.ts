import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001, {
  cors: { origin: '*' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitNewOrder(order: any) {
    this.server.emit('new_order', order);
  }

  emitOrderStatusUpdated(order: any) {
    this.server.emit('order_status_updated', order);
  }

  emitLowStockAlert(data: { item: string; current: number; minimum: number }) {
    this.server.emit('low_stock_alert', data);
  }
}
