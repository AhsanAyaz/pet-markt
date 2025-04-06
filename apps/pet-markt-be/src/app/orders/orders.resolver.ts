import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { OrderDeletionResp } from './dto/order-deletion-response.dto';
import { UpdateOrderInput } from './dto/update-order.input';
import { UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('createOrderInput') createOrderInput: CreateOrderInput
  ) {
    let userId: string | undefined = undefined;
    const { token, ...orderData } = createOrderInput;
    if (token) {
      userId = await this.firebaseService.verifyToken(token);
    }
    return this.ordersService.create({ ...orderData, userId });
  }

  @Query(() => [Order], { name: 'userOrders' })
  async findByUserId(@Args('token', { type: () => String }) token: string) {
    console.log('token in backend userOrders', token);
    const userId = await this.firebaseService.verifyToken(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    console.log('userId in backend userOrders: authenticated: ', userId);
    return this.ordersService.findByUserId(userId);
  }

  @Query(() => Order, { name: 'order' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order)
  updateOrder(
    @Args('updateOrderInput', { type: () => UpdateOrderInput })
    updateOrderInput: UpdateOrderInput
  ) {
    return this.ordersService.update(updateOrderInput.id, updateOrderInput);
  }

  @Mutation(() => OrderDeletionResp)
  async removeOrder(
    @Args('id', { type: () => String }) id: string
  ): Promise<OrderDeletionResp> {
    return this.ordersService.removeUnpaid(id);
  }
}
