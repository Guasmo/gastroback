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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.recipe.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.inventoryItem.deleteMany();
    await prisma.user.deleteMany();
    const SALT = 10;
    const hash = (plain) => bcrypt.hash(plain, SALT);
    const customer = await prisma.user.create({
        data: { name: 'Juan Perez', email: 'juan@example.com', role: 'CUSTOMER', password: await hash('password123') }
    });
    await prisma.user.create({
        data: { name: 'Admin', email: 'admin@gastro.com', role: 'ADMIN', password: await hash('Admin1234!') }
    });
    await prisma.user.create({
        data: { name: 'Chef Cocina', email: 'kitchen@gastro.com', role: 'KITCHEN', password: await hash('password123') }
    });
    await prisma.user.create({
        data: { name: 'Cajero', email: 'cashier@gastro.com', role: 'CASHIER', password: await hash('password123') }
    });
    const catComida = await prisma.category.create({ data: { name: 'Comida' } });
    const catBebidas = await prisma.category.create({ data: { name: 'Bebidas' } });
    const catPostres = await prisma.category.create({ data: { name: 'Postres' } });
    const invCarne = await prisma.inventoryItem.create({ data: { name: 'Carne de Res 200g', unit: 'unidad', quantity: 50, minimumStock: 10, extraPrice: 2.00 } });
    const invQueso = await prisma.inventoryItem.create({ data: { name: 'Queso Cheddar', unit: 'lonchas', quantity: 100, minimumStock: 20, extraPrice: 0.75 } });
    const invPan = await prisma.inventoryItem.create({ data: { name: 'Pan Brioche', unit: 'unidad', quantity: 60, minimumStock: 15, extraPrice: 1.00 } });
    const invLechuga = await prisma.inventoryItem.create({ data: { name: 'Lechuga Fresca', unit: 'hojas', quantity: 200, minimumStock: 50, extraPrice: 0.25 } });
    const invPapas = await prisma.inventoryItem.create({ data: { name: 'Papas', unit: 'kg', quantity: 30, minimumStock: 5, extraPrice: 1.50 } });
    const p1 = await prisma.product.create({
        data: {
            name: 'Hamburguesa Doble Queso',
            description: 'Doble carne, doble queso cheddar fundido en pan brioche.',
            price: 8.50,
            imageUrl: '🍔',
            categoryId: catComida.id,
            recipes: {
                create: [
                    { inventoryItemId: invCarne.id, quantity: 2 },
                    { inventoryItemId: invQueso.id, quantity: 2 },
                    { inventoryItemId: invPan.id, quantity: 1 }
                ]
            }
        }
    });
    const p2 = await prisma.product.create({
        data: {
            name: 'Hamburguesa Clásica',
            description: 'Carne de res, lechuga y tomate en pan suave.',
            price: 5.50,
            imageUrl: '🍔',
            categoryId: catComida.id,
            recipes: {
                create: [
                    { inventoryItemId: invCarne.id, quantity: 1 },
                    { inventoryItemId: invLechuga.id, quantity: 2 },
                    { inventoryItemId: invPan.id, quantity: 1 }
                ]
            }
        }
    });
    const p3 = await prisma.product.create({
        data: { name: 'Papas Fritas', description: 'Porción grande y crujiente.', price: 2.50, imageUrl: '🍟', categoryId: catComida.id,
            recipes: { create: [{ inventoryItemId: invPapas.id, quantity: 0.25 }] }
        }
    });
    const p4 = await prisma.product.create({
        data: { name: 'Gaseosa Cola', description: 'Bebida fría 500ml', price: 1.50, imageUrl: '🥤', categoryId: catBebidas.id }
    });
    const p5 = await prisma.product.create({
        data: { name: 'Helado de Vainilla', description: 'Con sirope de chocolate.', price: 3.00, imageUrl: '🍦', categoryId: catPostres.id }
    });
    await prisma.order.create({
        data: {
            customerName: 'Mesa 1 - Ana',
            userId: customer.id,
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            total: 8.00,
            items: {
                create: [
                    { productId: p2.id, quantity: 1, priceAtTime: 5.50, notes: 'Sin cebolla por favor' },
                    { productId: p3.id, quantity: 1, priceAtTime: 2.50 }
                ]
            }
        }
    });
    await prisma.order.create({
        data: {
            customerName: 'Mesa 5 - Luis',
            userId: customer.id,
            status: 'PREPARING',
            paymentStatus: 'PAID',
            paymentMethod: 'EFECTIVO',
            total: 10.00,
            items: {
                create: [
                    { productId: p1.id, quantity: 1, priceAtTime: 8.50 },
                    { productId: p4.id, quantity: 1, priceAtTime: 1.50 }
                ]
            }
        }
    });
    await prisma.order.create({
        data: {
            customerName: 'Llevar - Marcos',
            userId: customer.id,
            status: 'READY',
            paymentStatus: 'PAID',
            paymentMethod: 'TRANSFERENCIA',
            receiptUrl: 'https://ejemplo.com/comprobante1.jpg',
            total: 11.50,
            items: {
                create: [
                    { productId: p1.id, quantity: 1, priceAtTime: 8.50 },
                    { productId: p5.id, quantity: 1, priceAtTime: 3.00 }
                ]
            }
        }
    });
    console.log('Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map