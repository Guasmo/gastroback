import { FileStorageService } from './file.storage.service';
import { PrismaService } from '../prisma.service';
export declare class UploadsController {
    private readonly fileStorage;
    private readonly prisma;
    private readonly logger;
    constructor(fileStorage: FileStorageService, prisma: PrismaService);
    uploadProductImage(id: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
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
            imageUrl: string;
        };
    }>;
    uploadReceipt(orderId: string, file: Express.Multer.File): Promise<{
        success: boolean;
        data: {
            order: {
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
            };
            receiptUrl: string;
        };
    }>;
}
