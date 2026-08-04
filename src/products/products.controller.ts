import { Controller, Get, Post, Delete, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.product.findMany({
      where: { isAvailable: true },
      include: { category: true, recipes: { include: { inventoryItem: true } } },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true, recipes: { include: { inventoryItem: true } } },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() data: {
    name: string;
    price: number;
    description?: string;
    imageUrl?: string;
    categoryId?: number;
    recipes?: { inventoryItemId: number; quantity: number; extraPrice?: number }[];
  }) {
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
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
}
