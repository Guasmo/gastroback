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
var FileStorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
let FileStorageService = FileStorageService_1 = class FileStorageService {
    cloudinary;
    logger = new common_1.Logger(FileStorageService_1.name);
    constructor(cloudinary) {
        this.cloudinary = cloudinary;
    }
    async uploadImage(file, folder = 'gastro-control/products') {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({
                folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' },
                    { quality: 'auto' },
                    { fetch_format: 'auto' },
                ],
            }, (error, result) => {
                if (error) {
                    this.logger.error(`Error uploading to Cloudinary: ${error.message}`);
                    return reject(error);
                }
                this.logger.log(`File uploaded: ${result.secure_url}`);
                resolve(result);
            });
            stream.end(file.buffer);
        });
    }
    async deleteFile(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId, { invalidate: true });
            this.logger.log(`File deleted: ${publicId}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error deleting: ${error.message}`);
            throw error;
        }
    }
    extractPublicId(url) {
        const regex = /\/v\d+\/(.+)\.\w+$/;
        const match = url.match(regex);
        return match ? match[1] : '';
    }
};
exports.FileStorageService = FileStorageService;
exports.FileStorageService = FileStorageService = FileStorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CLOUDINARY')),
    __metadata("design:paramtypes", [Object])
], FileStorageService);
//# sourceMappingURL=file.storage.service.js.map