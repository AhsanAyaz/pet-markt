import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  withState(initialState),
  withMethods((store, http = inject(HttpClient)) => ({
    loadProducts() {
      patchState(store, { loading: true });
      http.get<Product[]>('https://api.example.com/products').pipe(
        tap({
          next: (products) => patchState(store, { products, loading: false }),
          error: (error) => patchState(store, { error: error.message, loading: false }),
        })
      ).subscribe();
    },
  }))
) 