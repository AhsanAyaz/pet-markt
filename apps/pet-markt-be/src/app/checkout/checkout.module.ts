import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
