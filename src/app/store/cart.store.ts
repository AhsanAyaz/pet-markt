import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product } from '../models/product.model';
import { computed } from '@angular/core';

export interface CartState {
  items: Product[];
}

const initialState: CartState = {
  items: [],
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ items }) => ({
    totalItems: computed(() => items().length),
    totalPrice: computed(() => items().reduce((total, item) => total + item.price, 0)),
  })),
  withMethods((store) => ({
    addToCart(product: Product) {
      patchState(store, (state) => ({ items: [...state.items, product] }));
    },
    removeFromCart(productId: number) {
      patchState(store, (state) => ({
        items: state.items.filter((item) => item.id !== productId),
      }));
    },
    clearCart() {
      patchState(store, { items: [] });
    },
  }))
) 