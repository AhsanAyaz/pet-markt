import { OrderStatus } from '@prisma/client';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateOrderInput {
  @Field(() => String)
  id!: string;

  @Field(() => OrderStatus)
  status!: OrderStatus;
}
