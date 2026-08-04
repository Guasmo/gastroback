import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileStorageService } from './file.storage.service';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('upload')
export class UploadsController {
  private readonly logger = new Logger(UploadsController.name);

  constructor(
    private readonly fileStorage: FileStorageService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('product-image/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProductImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ninguna imagen');
    }

    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new BadRequestException('ID de producto inválido');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new BadRequestException('Producto no encontrado');
    }

    if (product.imageUrl && product.imageUrl.includes('cloudinary.com')) {
      const oldPublicId = this.fileStorage.extractPublicId(product.imageUrl);
      if (oldPublicId) {
        try { await this.fileStorage.deleteFile(oldPublicId); } catch {}
      }
    }

    const result = await this.fileStorage.uploadImage(file);
    const updated = await this.prisma.product.update({
      where: { id: productId },
      data: { imageUrl: result.secure_url },
    });

    return { success: true, data: { product: updated, imageUrl: result.secure_url } };
  }

  @Post('receipt/:orderId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('receipt'))
  async uploadReceipt(
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se proporcionó ningún comprobante');
    }

    const orderIdNum = parseInt(orderId, 10);
    if (isNaN(orderIdNum)) {
      throw new BadRequestException('ID de orden inválido');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderIdNum } });
    if (!order) {
      throw new BadRequestException('Orden no encontrada');
    }

    const result = await this.fileStorage.uploadImage(file, 'gastro-control/receipts');
    const updated = await this.prisma.order.update({
      where: { id: orderIdNum },
      data: { receiptUrl: result.secure_url, paymentMethod: 'TRANSFERENCIA' },
    });

    return { success: true, data: { order: updated, receiptUrl: result.secure_url } };
  }
}
