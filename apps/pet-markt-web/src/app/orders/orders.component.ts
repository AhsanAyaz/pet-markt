import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderStore } from '../stores/order.store';
import { RouterLink } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent implements OnInit {
  orderStore = inject(OrderStore);
  getOrders = rxMethod<void>(
    pipe(switchMap(() => this.orderStore.getUserOrders()))
  );
  ngOnInit() {
    this.getOrders();
  }
}
