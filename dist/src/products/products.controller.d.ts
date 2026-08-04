import { PrismaService } from '../prisma.service';
export declare class ProductsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        } | null;
        recipes: ({
            inventoryItem: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                unit: string;
                quantity: number;
                minimumStock: number;
                extraPrice: number;
            };
        } & {
            id: number;
            quantity: number;
            extraPrice: number;
            inventoryItemId: number;
            productId: number;
        })[];
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: number | null;
    })[]>;
    findOne(id: string): Promise<({
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        } | null;
        recipes: ({
            inventoryItem: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                unit: string;
                quantity: number;
                minimumStock: number;
                extraPrice: number;
            };
        } & {
            id: number;
            quantity: number;
            extraPrice: number;
            inventoryItemId: number;
            productId: number;
        })[];
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: number | null;
    }) | null>;
    create(data: {
        name: string;
        price: number;
        description?: string;
        imageUrl?: string;
        categoryId?: number;
        recipes?: {
            inventoryItemId: number;
            quantity: number;
            extraPrice?: number;
        }[];
    }): Promise<{
        category: {
            name: string;
            createdAt: Date;
            updatedAt: Date;
            id: number;
        } | null;
        recipes: ({
            inventoryItem: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                unit: string;
                quantity: number;
                minimumStock: number;
                extraPrice: number;
            };
        } & {
            id: number;
            quantity: number;
            extraPrice: number;
            inventoryItemId: number;
            productId: number;
        })[];
    } & {
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isAvailable: boolean;
        categoryId: number | null;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
