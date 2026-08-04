import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { EventsGateway } from '../gateway/events.gateway';
import { JwtAuthGuard, RolesGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(@Body() data: {
    customerName: string;
    total: number;
    observations?: string;
    items: { productId: number; quantity: number; price: number; notes?: string }[];
    paymentMethod?: string;
  }) {
    const order = await this.prisma.order.create({
      data: {
        customerName: data.customerName,
        total: data.total,
        observations: data.observations || null,
        paymentMethod: data.paymentMethod || null,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        items: {
          create: data.items.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            priceAtTime: i.price,
            notes: i.notes || null,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    this.eventsGateway.emitNewOrder(order);
    return order;
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'KITCHEN')
  async updateStatus(
    @Param('id') id: string,
    @Body() data: { status: string },
  ) {
    const order = await this.prisma.order.update({
      where: { id: parseInt(id) },
      data: { status: data.status },
      include: { items: { include: { product: true } } },
    });

    if (data.status === 'PREPARING') {
      await this.deductInventory(order);
    }

    this.eventsGateway.emitOrderStatusUpdated(order);
    return order;
  }

  @Patch(':id/payment')
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN', 'CASHIER')
  async updatePayment(
    @Param('id') id: string,
    @Body() data: { method?: string; receiptUrl?: string },
  ) {
    const updateData: any = { paymentStatus: 'PAID' };
    if (data.method) updateData.paymentMethod = data.method;
    if (data.receiptUrl) updateData.receiptUrl = data.receiptUrl;

    return this.prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: { items: { include: { product: true } } },
    });
  }

  private async deductInventory(order: any) {
    for (const item of order.items) {
      const recipes = await this.prisma.recipe.findMany({
        where: { productId: item.productId },
      });

      for (const recipe of recipes) {
        const deduction = recipe.quantity * item.quantity;
        const inventoryItem = await this.prisma.inventoryItem.findUnique({
          where: { id: recipe.inventoryItemId },
        });

        if (inventoryItem) {
          const newQuantity = Math.max(0, inventoryItem.quantity - deduction);
          await this.prisma.inventoryItem.update({
            where: { id: recipe.inventoryItemId },
            data: { quantity: newQuantity },
          });

          if (newQuantity <= inventoryItem.minimumStock && inventoryItem.minimumStock > 0) {
            this.eventsGateway.emitLowStockAlert({
              item: inventoryItem.name,
              current: newQuantity,
              minimum: inventoryItem.minimumStock,
            });
          }
        }
      }
    }
  }
}
