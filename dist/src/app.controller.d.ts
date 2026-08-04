import { PrismaService } from './prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    seed(): Promise<{
        message: string;
        users: {
            admin: string | null;
            kitchen: string | null;
            cashier: string | null;
            customer: string | null;
        };
        password: string;
    }>;
}
