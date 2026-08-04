"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uploads_controller_1 = require("./uploads.controller");
const file_storage_service_1 = require("./file.storage.service");
const cloudinary_config_1 = require("../config/cloudinary.config");
const prisma_module_1 = require("../prisma.module");
let UploadsModule = class UploadsModule {
};
exports.UploadsModule = UploadsModule;
exports.UploadsModule = UploadsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
            prisma_module_1.PrismaModule,
            platform_express_1.MulterModule.register({
                storage: (0, multer_1.memoryStorage)(),
                fileFilter: (req, file, cb) => {
                    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
                    if (!allowed.includes(file.mimetype)) {
                        return cb(new Error('Solo se permiten imágenes (JPG, PNG, WEBP)'), false);
                    }
                    cb(null, true);
                },
                limits: { fileSize: 5 * 1024 * 1024 },
            }),
        ],
        controllers: [uploads_controller_1.UploadsController],
        providers: [cloudinary_config_1.CloudinaryProvider, file_storage_service_1.FileStorageService],
        exports: [file_storage_service_1.FileStorageService],
    })
], UploadsModule);
//# sourceMappingURL=uploads.module.js.map