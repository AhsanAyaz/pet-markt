import {
  ObjectType,
  Field,
  Float,
  ID,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderItem } from './order-item.entity';
import { OrderStatus } from '@prisma/client';

@ObjectType()
export class Order {
  @Field(() => ID)
  id!: string;

  @Field(() => [OrderItem])
  items!: OrderItem[];

  @Field(() => Float)
  totalAmount!: number;

  @Field(() => String)
  status!: OrderStatus;

  @Field(() => String, { nullable: true })
  paymentId?: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});
