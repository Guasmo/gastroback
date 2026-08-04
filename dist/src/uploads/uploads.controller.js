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
var UploadsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const file_storage_service_1 = require("./file.storage.service");
const prisma_service_1 = require("../prisma.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let UploadsController = UploadsController_1 = class UploadsController {
    fileStorage;
    prisma;
    logger = new common_1.Logger(UploadsController_1.name);
    constructor(fileStorage, prisma) {
        this.fileStorage = fileStorage;
        this.prisma = prisma;
    }
    async uploadProductImage(id, file) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ninguna imagen');
        }
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
            throw new common_1.BadRequestException('ID de producto inválido');
        }
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            throw new common_1.BadRequestException('Producto no encontrado');
        }
        if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
            const oldPublicId = this.fileStorage.extractPublicId(product.imageUrl);
            if (oldPublicId) {
                try {
                    await this.fileStorage.deleteFile(oldPublicId);
                }
                catch { }
            }
        }
        const result = await this.fileStorage.uploadImage(file);
        const updated = await this.prisma.product.update({
            where: { id: productId },
            data: { imageUrl: result.secure_url },
        });
        return { success: true, data: { product: updated, imageUrl: result.secure_url } };
    }
    async uploadReceipt(orderId, file) {
        if (!file) {
            throw new common_1.BadRequestException('No se proporcionó ningún comprobante');
        }
        const orderIdNum = parseInt(orderId, 10);
        if (isNaN(orderIdNum)) {
            throw new common_1.BadRequestException('ID de orden inválido');
        }
        const order = await this.prisma.order.findUnique({ where: { id: orderIdNum } });
        if (!order) {
            throw new common_1.BadRequestException('Orden no encontrada');
        }
        const result = await this.fileStorage.uploadImage(file, 'gastro-control/receipts');
        const updated = await this.prisma.order.update({
            where: { id: orderIdNum },
            data: { receiptUrl: result.secure_url, paymentMethod: 'TRANSFERENCIA' },
        });
        return { success: true, data: { order: updated, receiptUrl: result.secure_url } };
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)('product-image/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, jwt_auth_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadProductImage", null);
__decorate([
    (0, common_1.Post)('receipt/:orderId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('receipt')),
    __param(0, (0, common_1.Param)('orderId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadReceipt", null);
exports.UploadsController = UploadsController = UploadsController_1 = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [file_storage_service_1.FileStorageService,
        prisma_service_1.PrismaService])
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map