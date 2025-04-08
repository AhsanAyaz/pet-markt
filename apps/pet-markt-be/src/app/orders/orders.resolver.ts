import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { DeleteOrderResp } from './dto/delete-order-resp';
import { FirebaseService } from '../firebase/firebase.service';
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Mutation(() => Order)
  createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput) {
    return this.ordersService.create(createOrderInput);
  }

  @Query(() => [Order], { name: 'userOrders' })
  async findUserOrders(@Args('token', { type: () => String }) token: string) {
    const userId = await this.firebaseService.verifyToken(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return this.ordersService.findUserOrders(userId);
  }

  @Query(() => [Order], { name: 'orders' })
  findAll() {
    return this.ordersService.findAll();
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

  @Mutation(() => DeleteOrderResp)
  removeUnpaid(@Args('id', { type: () => String }) id: string) {
    return this.ordersService.removeUnpaid(id);
  }
}
