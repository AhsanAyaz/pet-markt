// import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
// import { Product } from '../models/product.model';
// import { computed } from '@angular/core';

// export interface CartState {
//   items: Product[];
// }

// const initialState: CartState = {
//   items: [],
// };

// export const CartStore = signalStore(
//   { providedIn: 'root' },
//   withState(initialState),
//   withComputed(({ items }) => ({
//     totalItems: computed(() => items().length),
//     totalPrice: computed(() => items().reduce((total, item) => total + item.price, 0)),
//   })),
//   withMethods((store) => ({
//     addToCart(product: Product) {
//       patchState(store, (state) => ({ items: [...state.items, product] }));
//     },
//     removeFromCart(productId: number) {
//       patchState(store, (state) => ({
//         items: state.items.filter((item) => item.id !== productId),
//       }));
//     },
//     clearCart() {
//       patchState(store, { items: [] });
//     },
//   }))
// )

import { computed, effect, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withState,
  withMethods,
  patchState,
} from '@ngrx/signals';
import { CartItem, Product } from '../models/product.model';

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(() => {
    if ('localStorage' in globalThis) {
      return {
        ...initialState,
        items: JSON.parse(localStorage.getItem('cart') ?? '[]') as CartItem[],
      };
    }
    return initialState;
  }),
  withComputed(({ items }) => ({
    totalItems: computed(() =>
      items().reduce((acc, item) => acc + item.quantity, 0)
    ),
    totalAmount: computed(() =>
      items().reduce((acc, item) => acc + item.price * item.quantity, 0)
    ),
  })),
  withMethods((store) => ({
    addToCart(product: Product, quantity = 1) {
      const currentItems = store.items();
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        const updatedItems = currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        patchState(store, { items: updatedItems });
      } else {
        patchState(store, {
          items: [...currentItems, { ...product, quantity }],
        });
      }

      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(store.items()));
    },

    removeFromCart(productId: number) {
      const updatedItems = store
        .items()
        .filter((item) => item.id !== productId);
      patchState(store, { items: updatedItems });
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    },

    updateQuantity(productId: number, quantity: number) {
      const updatedItems = store
        .items()
        .map((item) => (item.id === productId ? { ...item, quantity } : item));
      patchState(store, { items: updatedItems });
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    },

    clearCart() {
      patchState(store, { items: [] });
      localStorage.removeItem('cart');
    },

    loadCart() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        patchState(store, { items: JSON.parse(savedCart) });
      }
    },
  }))
);
