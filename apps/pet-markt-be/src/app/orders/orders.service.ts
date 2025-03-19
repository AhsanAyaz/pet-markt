import { Injectable } from '@nestjs/common';
import { CreateOrderInput } from './dto/create-order.input';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
import { OrderDeletionResp } from './dto/order-deletion-response.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}
  create(createOrderInput: CreateOrderInput) {
    const { totalAmount, items } = createOrderInput;
    return this.prisma.order.create({
      data: {
        totalAmount,
        status: 'PAYMENT_REQUIRED',
        items: {
          create: items.map((item) => ({
            quantity: item.quantity,
            price: item.price,
            product: {
              connect: {
                id: item.productId,
              },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  update(id: string, updateOrderInput: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({
      where: {
        id,
      },
      data: {
        ...updateOrderInput,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  remove(id: string) {
    return this.prisma.order.delete({
      where: { id },
    });
  }

  async removeUnpaid(id: string): Promise<OrderDeletionResp> {
    const order = await this.prisma.order.findUnique({
      where: { id: id },
    });

    if (!order) {
      return { success: true, orderId: id }; // Or return { success: true } if you prefer.
    }
    if (order.status === OrderStatus.PAYMENT_REQUIRED) {
      await this.prisma.order.delete({
        where: { id: id },
      });
      return { success: true, orderId: id };
    }

    return {
      success: false,
      orderId: id,
      error: 'Order is not in PAYMENT_REQUIRED state',
    };
  }
}
