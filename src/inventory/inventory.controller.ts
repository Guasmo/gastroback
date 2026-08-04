import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.prisma.inventoryItem.findMany({
      orderBy: { name: 'asc' },
    });
  }

  @Get('alerts')
  @UseGuards(JwtAuthGuard)
  async getAlerts() {
    return this.prisma.inventoryItem.findMany({
      where: {
        quantity: { lte: this.prisma.inventoryItem.fields.minimumStock },
        minimumStock: { gt: 0 },
      },
    });
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async create(@Body() data: { name: string; unit: string; quantity?: number; minimumStock?: number; extraPrice?: number }) {
    return this.prisma.inventoryItem.create({
      data: {
        name: data.name,
        unit: data.unit,
        quantity: data.quantity || 0,
        minimumStock: data.minimumStock || 0,
        extraPrice: data.extraPrice || 0,
      },
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() data: { quantity?: number; minimumStock?: number; extraPrice?: number }) {
    return this.prisma.inventoryItem.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async remove(@Param('id') id: string) {
    return this.prisma.inventoryItem.delete({ where: { id: parseInt(id) } });
  }
}
