import { afterNextRender, Component, inject } from '@angular/core';
import { ProductStore } from '../store/product.store';
import { ProductCardComponent } from '../components/product-card/product-card.component';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Product } from '../models/product.model';
import { CartStore } from '../store/cart.store';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  host: {
    ngSkipHydration: 'true',
  },
})
export class ProductsComponent {
  productStore = inject(ProductStore);
  cartStore = inject(CartStore);
  searchTerm = '';
  private searchSubject = new Subject<string>();

  constructor() {
    afterNextRender(() => {
      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((term) => {
          this.productStore.searchProducts(term);
        });
    });
    this.productStore.loadProducts();
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  addToCart(product: Product) {
    this.cartStore.addToCart(product);
  }
}
