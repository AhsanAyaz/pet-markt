import { afterNextRender, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../../stores/order.store';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailComponent } from '../../components/order-detail/order-detail.component';
import { CartStore } from '../../stores/cart.store';
import { EMPTY, mergeMap } from 'rxjs';

@Component({
  selector: 'app-checkout-success',
  imports: [CommonModule, OrderDetailComponent],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);
  cartStore = inject(CartStore);

  constructor() {
    afterNextRender(() => {
      this.cartStore.clearCart();
    });
  }

  ngOnInit() {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }
    this.orderStore
      .getOrder(orderId, null)
      .pipe(
        mergeMap((order) => {
          if (order.status === 'PAYMENT_REQUIRED') {
            return this.orderStore.updateOrder(order.id, 'PENDING');
          }
          return EMPTY;
        })
      )
      .subscribe();
  }
}
