import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { OrdersModule } from '../orders/orders.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [OrdersModule, FirebaseModule],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
