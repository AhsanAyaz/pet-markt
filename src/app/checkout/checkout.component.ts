import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StripeService } from '../services/stripe.service';
import { CartStore } from '../store/cart.store';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent {
  cart = inject(CartStore);
  stripeService = inject(StripeService);

  async checkout() {
    try {
      await this.stripeService.createCheckoutSession();
    } catch (error) {
      console.error('Checkout error:', error);
    }
  }
}
