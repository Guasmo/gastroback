import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../gateway/events.gateway';
export declare class OrdersController {
    private readonly prisma;
    private readonly eventsGateway;
    constructor(prisma: PrismaService, eventsGateway: EventsGateway);
    findAll(): Promise<({
        items: ({
            product: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: number | null;
            };
        } & {
            id: number;
            quantity: number;
            priceAtTime: number;
            notes: string | null;
            productId: number;
            orderId: number;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        customerName: string;
        status: string;
        paymentStatus: string;
        paymentMethod: string | null;
        receiptUrl: string | null;
        observations: string | null;
        total: number;
        userId: number | null;
    })[]>;
    create(data: {
        customerName: string;
        total: number;
        observations?: string;
        items: {
            productId: number;
            quantity: number;
            price: number;
            notes?: string;
        }[];
        paymentMethod?: string;
    }): Promise<{
        items: ({
            product: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: number | null;
            };
        } & {
            id: number;
            quantity: number;
            priceAtTime: number;
            notes: string | null;
            productId: number;
            orderId: number;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        customerName: string;
        status: string;
        paymentStatus: string;
        paymentMethod: string | null;
        receiptUrl: string | null;
        observations: string | null;
        total: number;
        userId: number | null;
    }>;
    updateStatus(id: string, data: {
        status: string;
    }): Promise<{
        items: ({
            product: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: number | null;
            };
        } & {
            id: number;
            quantity: number;
            priceAtTime: number;
            notes: string | null;
            productId: number;
            orderId: number;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        customerName: string;
        status: string;
        paymentStatus: string;
        paymentMethod: string | null;
        receiptUrl: string | null;
        observations: string | null;
        total: number;
        userId: number | null;
    }>;
    updatePayment(id: string, data: {
        method?: string;
        receiptUrl?: string;
    }): Promise<{
        items: ({
            product: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                description: string | null;
                price: number;
                imageUrl: string | null;
                isAvailable: boolean;
                categoryId: number | null;
            };
        } & {
            id: number;
            quantity: number;
            priceAtTime: number;
            notes: string | null;
            productId: number;
            orderId: number;
        })[];
    } & {
        createdAt: Date;
        updatedAt: Date;
        id: number;
        customerName: string;
        status: string;
        paymentStatus: string;
        paymentMethod: string | null;
        receiptUrl: string | null;
        observations: string | null;
        total: number;
        userId: number | null;
    }>;
    private deductInventory;
}
