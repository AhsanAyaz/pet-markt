import { Component, inject } from '@angular/core';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [],
  templateUrl: './checkout-success.component.html',
  styleUrl: './checkout-success.component.scss',
})
export class CheckoutSuccessComponent {
  cart = inject(CartStore);

  clearCart() {
    this.cart.clearCart();
  }
}
