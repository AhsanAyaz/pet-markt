import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformServer } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderStore } from '../../stores/order.store';

@Component({
  selector: 'app-checkout-failure',
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-failure.component.html',
  styleUrl: './checkout-failure.component.scss',
})
export class CheckoutFailureComponent implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);
  platformId = inject(PLATFORM_ID);
  ngOnInit() {
    if (!isPlatformServer(this.platformId)) {
      return;
    }
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }
    this.orderStore.deleteUnpaidOrder(orderId).subscribe();
  }
}
