import { UploadApiResponse } from 'cloudinary';
export declare class FileStorageService {
    private readonly cloudinary;
    private readonly logger;
    constructor(cloudinary: any);
    uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadApiResponse>;
    deleteFile(publicId: string): Promise<any>;
    extractPublicId(url: string): string;
}
