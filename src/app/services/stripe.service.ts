import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { CartStore } from '../store/cart.store';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private http = inject(HttpClient);
  private cartStore = inject(CartStore);
  private stripe: Promise<Stripe | null>;

  constructor() {
    this.stripe = loadStripe(environment.stripePublicKey);
  }

  async createCheckoutSession() {
    const items = this.cartStore.items();

    try {
      const session = await this.http
        .post<{ url: string }>('/api/checkout', {
          items: items.map((item) => ({
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [item.image],
              },
              unit_amount: item.price * 100, // Convert to cents
            },
            quantity: item.quantity,
          })),
        })
        .toPromise();
      console.log(session);
      if (!session) {
        return;
      }

      location.href = session.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
}
