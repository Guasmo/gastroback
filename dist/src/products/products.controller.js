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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let ProductsController = class ProductsController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.product.findMany({
            where: { isAvailable: true },
            include: { category: true, recipes: { include: { inventoryItem: true } } },
        });
    }
    async findOne(id) {
        return this.prisma.product.findUnique({
            where: { id: parseInt(id) },
            include: { category: true, recipes: { include: { inventoryItem: true } } },
        });
    }
    async create(data) {
        return this.prisma.product.create({
            data: {
                name: data.name,
                price: parseFloat(data.price.toString()),
                description: data.description,
                imageUrl: data.imageUrl || '',
                categoryId: data.categoryId || undefined,
                recipes: data.recipes && data.recipes.length > 0
                    ? { create: data.recipes.map(r => ({ inventoryItemId: r.inventoryItemId, quantity: r.quantity, extraPrice: r.extraPrice || 0 })) }
                    : undefined,
            },
            include: { category: true, recipes: { include: { inventoryItem: true } } },
        });
    }
    async remove(id) {
        const productId = parseInt(id);
        const orderItems = await this.prisma.orderItem.findFirst({
            where: { productId },
        });
        if (orderItems) {
            await this.prisma.product.update({
                where: { id: productId },
                data: { isAvailable: false },
            });
            return { success: true, message: 'Producto ocultado del catalogo (tiene pedidos asociados)' };
        }
        await this.prisma.recipe.deleteMany({ where: { productId } });
        await this.prisma.product.delete({ where: { id: productId } });
        return { success: true, message: 'Producto eliminado permanentemente' };
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, jwt_auth_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, jwt_auth_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "remove", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map