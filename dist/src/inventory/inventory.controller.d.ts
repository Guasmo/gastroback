import { PrismaService } from '../prisma.service';
export declare class InventoryController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        unit: string;
        quantity: number;
        minimumStock: number;
        extraPrice: number;
    }[]>;
    getAlerts(): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        unit: string;
        quantity: number;
        minimumStock: number;
        extraPrice: number;
    }[]>;
    create(data: {
        name: string;
        unit: string;
        quantity?: number;
        minimumStock?: number;
        extraPrice?: number;
    }): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        unit: string;
        quantity: number;
        minimumStock: number;
        extraPrice: number;
    }>;
    update(id: string, data: {
        quantity?: number;
        minimumStock?: number;
        extraPrice?: number;
    }): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        unit: string;
        quantity: number;
        minimumStock: number;
        extraPrice: number;
    }>;
    remove(id: string): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        unit: string;
        quantity: number;
        minimumStock: number;
        extraPrice: number;
    }>;
}
