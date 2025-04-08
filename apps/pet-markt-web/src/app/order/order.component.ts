import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';
import { OrderStore } from '../stores/order.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  imports: [CommonModule, OrderDetailComponent],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  orderStore = inject(OrderStore);
  route = inject(ActivatedRoute);
  getOrder = rxMethod<string>(
    pipe(switchMap((orderId) => this.orderStore.getOrder(orderId)))
  );

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }
    this.getOrder(orderId);
  }
}
