import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private readonly logger;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    emitNewOrder(order: any): void;
    emitOrderStatusUpdated(order: any): void;
    emitLowStockAlert(data: {
        item: string;
        current: number;
        minimum: number;
    }): void;
}
