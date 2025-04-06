import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Product } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { catchError, EMPTY, map, pipe, switchMap, tap } from 'rxjs';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
`;

const SEARCH_PRODUCTS = gql`
  query SearchProducts($searchTerm: String!) {
    searchProducts(term: $searchTerm) {
      id
      name
      description
      price
      image
      stripePriceId
    }
  }
`;

const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($featured: Boolean) {
    products(featured: $featured) {
      id
      name
      description
      price
      image
      stripePriceId
      isFeatured
    }
  }
`;

export interface ProductState {
  products: Product[];
  featuredProducts: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  featuredProducts: [],
  loading: false,
  error: null,
};

export const ProductStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
    loadProducts: rxMethod<void>(
      pipe(
        switchMap(() => {
          patchState(store, { loading: true, error: null });
          return apollo.watchQuery<{ products: Product[] }>({
            query: GET_PRODUCTS,
          }).valueChanges;
        }),
        tap({
          next: ({ data }) =>
            patchState(store, { products: data.products, loading: false }),
          error: (error) =>
            patchState(store, { error: error.message, loading: false }),
        })
      )
    ),
    searchProducts: rxMethod<string>(
      pipe(
        switchMap((term: string) =>
          apollo.query<{ searchProducts: Product[] }>({
            query: SEARCH_PRODUCTS,
            variables: {
              searchTerm: term,
            },
          })
        ),
        map(({ data }) =>
          patchState(store, { products: data.searchProducts, loading: false })
        ),
        catchError((error) => {
          patchState(store, { error: error.message, loading: false });
          return EMPTY;
        })
      )
    ),
    loadFeaturedProducts: rxMethod<void>(
      pipe(
        switchMap(() =>
          apollo.query<{ products: Product[] }>({
            query: GET_FEATURED_PRODUCTS,
            variables: { featured: true },
          })
        ),
        map(({ data }) => {
          patchState(store, {
            products: data.products,
            loading: false,
          });
        }),
        catchError((error) => {
          patchState(store, { error: error.message, loading: false });
          return EMPTY;
        })
      )
    ),
  }))
);
