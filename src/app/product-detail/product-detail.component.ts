import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { CartStore } from '../store/cart.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private cartStore = inject(CartStore);

  product: Product | null = null;
  quantity = 1;
  selectedVariation = '';

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    // Replace with actual API call
    this.product = {
      id: 1,
      name: 'Premium Dog Food',
      description: 'High-quality dog food for all breeds',
      price: 29.99,
      image: 'assets/dog-food.jpg',
      stripePriceId: '1',
    };
  }

  addToCart() {
    if (this.product) {
      this.cartStore.addToCart(this.product, this.quantity);
    }
  }
}
