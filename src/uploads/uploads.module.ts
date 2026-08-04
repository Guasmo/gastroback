import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsController } from './uploads.controller';
import { FileStorageService } from './file.storage.service';
import { CloudinaryProvider } from '../config/cloudinary.config';
import { PrismaModule } from '../prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    MulterModule.register({
      storage: memoryStorage(),
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
  controllers: [UploadsController],
  providers: [CloudinaryProvider, FileStorageService],
  exports: [FileStorageService],
})
export class UploadsModule {}
