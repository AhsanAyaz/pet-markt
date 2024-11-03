import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartStore } from '../store/cart.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent {
  cart = inject(CartStore);

  updateQuantity(productId: number, event: Event) {
    const quantity = parseInt((event.target as HTMLInputElement).value);
    if (quantity > 0) {
      this.cart.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number) {
    this.cart.removeFromCart(productId);
  }
}
