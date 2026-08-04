import { Inject, Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);

  constructor(@Inject('CLOUDINARY') private readonly cloudinary: any) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'gastro-control/products',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error: any, result: UploadApiResponse) => {
          if (error) {
            this.logger.error(`Error uploading to Cloudinary: ${error.message}`);
            return reject(error);
          }
          this.logger.log(`File uploaded: ${result.secure_url}`);
          resolve(result);
        },
      );

      stream.end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
      this.logger.log(`File deleted: ${publicId}`);
      return result;
    } catch (error: any) {
      this.logger.error(`Error deleting: ${error.message}`);
      throw error;
    }
  }

  extractPublicId(url: string): string {
    const regex = /\/v\d+\/(.+)\.\w+$/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }
}
