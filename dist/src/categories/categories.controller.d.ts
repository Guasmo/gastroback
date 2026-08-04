import { PrismaService } from '../prisma.service';
export declare class CategoriesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }[]>;
    create(data: {
        name: string;
    }): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
    }>;
}
