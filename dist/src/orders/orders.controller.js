"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const events_gateway_1 = require("../gateway/events.gateway");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let OrdersController = class OrdersController {
    prisma;
    eventsGateway;
    constructor(prisma, eventsGateway) {
        this.prisma = prisma;
        this.eventsGateway = eventsGateway;
    }
    async findAll() {
        return this.prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(data) {
        const order = await this.prisma.order.create({
            data: {
                customerName: data.customerName,
                total: data.total,
                observations: data.observations || null,
                paymentMethod: data.paymentMethod || null,
                status: 'PENDING',
                paymentStatus: 'UNPAID',
                items: {
                    create: data.items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        priceAtTime: i.price,
                        notes: i.notes || null,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });
        this.eventsGateway.emitNewOrder(order);
        return order;
    }
    async updateStatus(id, data) {
        const order = await this.prisma.order.update({
            where: { id: parseInt(id) },
            data: { status: data.status },
            include: { items: { include: { product: true } } },
        });
        if (data.status === 'PREPARING') {
            await this.deductInventory(order);
        }
        this.eventsGateway.emitOrderStatusUpdated(order);
        return order;
    }
    async updatePayment(id, data) {
        const updateData = { paymentStatus: 'PAID' };
        if (data.method)
            updateData.paymentMethod = data.method;
        if (data.receiptUrl)
            updateData.receiptUrl = data.receiptUrl;
        return this.prisma.order.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { items: { include: { product: true } } },
        });
    }
    async deductInventory(order) {
        for (const item of order.items) {
            const recipes = await this.prisma.recipe.findMany({
                where: { productId: item.productId },
            });
            for (const recipe of recipes) {
                const deduction = recipe.quantity * item.quantity;
                const inventoryItem = await this.prisma.inventoryItem.findUnique({
                    where: { id: recipe.inventoryItemId },
                });
                if (inventoryItem) {
                    const newQuantity = Math.max(0, inventoryItem.quantity - deduction);
                    await this.prisma.inventoryItem.update({
                        where: { id: recipe.inventoryItemId },
                        data: { quantity: newQuantity },
                    });
                    if (newQuantity <= inventoryItem.minimumStock && inventoryItem.minimumStock > 0) {
                        this.eventsGateway.emitLowStockAlert({
                            item: inventoryItem.name,
                            current: newQuantity,
                            minimum: inventoryItem.minimumStock,
                        });
                    }
                }
            }
        }
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'KITCHEN'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/payment'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, roles_decorator_1.Roles)('ADMIN', 'CASHIER'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updatePayment", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        events_gateway_1.EventsGateway])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map