"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let AppController = class AppController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async seed() {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const admin = await this.prisma.user.upsert({
            where: { email: 'admin@gastro.com' },
            update: { password: hashedPassword, role: 'ADMIN' },
            create: {
                name: 'Administrador',
                email: 'admin@gastro.com',
                password: hashedPassword,
                role: 'ADMIN',
            },
        });
        const kitchen = await this.prisma.user.upsert({
            where: { email: 'kitchen@gastro.com' },
            update: { password: hashedPassword, role: 'KITCHEN' },
            create: {
                name: 'Cocinero',
                email: 'kitchen@gastro.com',
                password: hashedPassword,
                role: 'KITCHEN',
            },
        });
        const cashier = await this.prisma.user.upsert({
            where: { email: 'caja@gastro.com' },
            update: { password: hashedPassword, role: 'CASHIER' },
            create: {
                name: 'Cajero',
                email: 'caja@gastro.com',
                password: hashedPassword,
                role: 'CASHIER',
            },
        });
        const customer = await this.prisma.user.upsert({
            where: { email: 'cliente@gastro.com' },
            update: { password: hashedPassword, role: 'CUSTOMER' },
            create: {
                name: 'Cliente',
                email: 'cliente@gastro.com',
                password: hashedPassword,
                role: 'CUSTOMER',
            },
        });
        const comida = await this.prisma.category.upsert({
            where: { name: 'Comida' },
            update: {},
            create: { name: 'Comida' },
        });
        const bebidas = await this.prisma.category.upsert({
            where: { name: 'Bebidas' },
            update: {},
            create: { name: 'Bebidas' },
        });
        const inventoryItems = [
            { name: 'Carne de Res', unit: 'kg', quantity: 10, minimumStock: 2 },
            { name: 'Pollo', unit: 'kg', quantity: 8, minimumStock: 2 },
            { name: 'Pan de Hamburguesa', unit: 'unidades', quantity: 50, minimumStock: 10 },
            { name: 'Lechuga', unit: 'kg', quantity: 5, minimumStock: 1 },
            { name: 'Tomate', unit: 'kg', quantity: 4, minimumStock: 1 },
            { name: 'Café en Grano', unit: 'kg', quantity: 3, minimumStock: 0.5 },
            { name: 'Leche', unit: 'litros', quantity: 10, minimumStock: 2 },
            { name: 'Jugo de Naranja', unit: 'litros', quantity: 8, minimumStock: 2 },
        ];
        const createdInventory = {};
        for (const item of inventoryItems) {
            const existing = await this.prisma.inventoryItem.findFirst({ where: { name: item.name } });
            if (existing) {
                createdInventory[item.name] = existing;
            }
            else {
                createdInventory[item.name] = await this.prisma.inventoryItem.create({ data: item });
            }
        }
        const products = [
            { name: 'Café Americano', price: 1.50, imageUrl: '☕', categoryId: bebidas.id },
            { name: 'Sándwich de Pollo', price: 3.00, imageUrl: '🥪', categoryId: comida.id },
            { name: 'Jugo Natural', price: 1.50, imageUrl: '🥤', categoryId: bebidas.id },
            { name: 'Hamburguesa Clásica', price: 4.50, imageUrl: '🍔', categoryId: comida.id },
        ];
        const createdProducts = {};
        for (const p of products) {
            const existing = await this.prisma.product.findFirst({ where: { name: p.name } });
            if (existing) {
                createdProducts[p.name] = existing;
            }
            else {
                createdProducts[p.name] = await this.prisma.product.create({ data: p });
            }
        }
        const recipes = [
            { productName: 'Hamburguesa Clásica', ingredient: 'Carne de Res', quantity: 0.2, extraPrice: 1.50 },
            { productName: 'Hamburguesa Clásica', ingredient: 'Pan de Hamburguesa', quantity: 1, extraPrice: 0.50 },
            { productName: 'Hamburguesa Clásica', ingredient: 'Lechuga', quantity: 0.05, extraPrice: 0.30 },
            { productName: 'Hamburguesa Clásica', ingredient: 'Tomate', quantity: 0.05, extraPrice: 0.30 },
            { productName: 'Sándwich de Pollo', ingredient: 'Pollo', quantity: 0.15, extraPrice: 1.00 },
            { productName: 'Sándwich de Pollo', ingredient: 'Pan de Hamburguesa', quantity: 1, extraPrice: 0.50 },
            { productName: 'Café Americano', ingredient: 'Café en Grano', quantity: 0.02, extraPrice: 0.50 },
            { productName: 'Café Americano', ingredient: 'Leche', quantity: 0.1, extraPrice: 0.30 },
            { productName: 'Jugo Natural', ingredient: 'Jugo de Naranja', quantity: 0.3, extraPrice: 0.75 },
        ];
        for (const r of recipes) {
            const product = createdProducts[r.productName];
            const inventoryItem = createdInventory[r.ingredient];
            if (product && inventoryItem) {
                const existing = await this.prisma.recipe.findFirst({
                    where: { productId: product.id, inventoryItemId: inventoryItem.id },
                });
                if (!existing) {
                    await this.prisma.recipe.create({
                        data: {
                            productId: product.id,
                            inventoryItemId: inventoryItem.id,
                            quantity: r.quantity,
                            extraPrice: r.extraPrice || 0,
                        },
                    });
                }
            }
        }
        return {
            message: 'Database seeded successfully',
            users: { admin: admin.email, kitchen: kitchen.email, cashier: cashier.email, customer: customer.email },
            password: 'password123',
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "seed", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map