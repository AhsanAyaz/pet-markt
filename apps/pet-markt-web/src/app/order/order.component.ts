import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderStore } from '../stores/order.store';
import { AuthService } from '../auth/auth.service';
import { OrderDetailComponent } from '../components/order-detail/order-detail.component';

@Component({
  selector: 'app-order',
  imports: [CommonModule, OrderDetailComponent, RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
})
export class OrderComponent implements OnInit {
  private route = inject(ActivatedRoute);
  orderStore = inject(OrderStore);

  private auth = inject(AuthService);

  async ngOnInit() {
    const orderId = this.route.snapshot.params['id'];
    if (!orderId) {
      this.orderStore.setError('No order ID found');
      return;
    }

    const token = await this.auth.getToken();
    this.orderStore.getOrder(orderId, token).subscribe();
  }
}
