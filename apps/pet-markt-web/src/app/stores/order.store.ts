import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Order, OrderItem, OrderStatus, Product } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { catchError, EMPTY, from, map, pipe, switchMap, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      id
      totalAmount
      status
      items {
        id
        quantity
        price
        product {
          id
          name
          image
        }
      }
      createdAt
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrderStatus($id: String!, $status: OrderStatus!) {
    updateOrder(updateOrderInput: { id: $id, status: $status }) {
      id
      status
      totalAmount # Include other fields you want to see in the response
      items {
        id
        quantity
        price
        product {
          id
          name
          image
        }
      }
      updatedAt
    }
  }
`;

const DELETE_UNPAID_ORDER = gql`
  mutation RemoveOrder($id: String!) {
    removeUnpaid(id: $id) {
      orderId
      success
      error
    }
  }
`;

const GET_USER_ORDERS = gql`
  query GetUserOrders($token: String!) {
    userOrders(token: $token) {
      id
      totalAmount
      status
      items {
        id
        quantity
        price
        product {
          id
          name
          image
        }
      }
      createdAt
    }
  }
`;

export type OrderItemWithProduct = OrderItem & {
  product: Product;
};

export type OrderWithItems = Order & {
  items: OrderItemWithProduct[];
};

type OrderState = {
  loading: boolean;
  orders: OrderWithItems[];
  orderDetail: OrderWithItems | null;
  error: string | null;
};

const initialState: OrderState = {
  loading: false,
  orders: [],
  orderDetail: null,
  error: null,
};

export const OrderStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(() => initialState),
  withMethods((store, apollo = inject(Apollo), auth = inject(AuthService)) => ({
    getOrder(id: string) {
      patchState(store, { error: null });
      return apollo
        .query<{ order: OrderWithItems }>({
          query: GET_ORDER,
          variables: {
            id,
          },
        })
        .pipe(
          tap({
            next: ({ data }) => patchState(store, { orderDetail: data.order }),
            error: (error) => patchState(store, { error: error.message }),
          }),
          map(({ data }) => data.order)
        );
    },
    getUserOrders() {
      patchState(store, { loading: true, error: null });
      return from(auth.getToken()).pipe(
        switchMap((token) => {
          if (!token) {
            throw new Error('User not authenticated');
          }
          return apollo.query<{ userOrders: OrderWithItems[] }>({
            query: GET_USER_ORDERS,
            variables: {
              token,
            },
          });
        }),
        tap((result) => {
          patchState(store, {
            orders: result.data.userOrders,
            loading: false,
            error: null,
          });
        }),
        catchError((err) => {
          patchState(store, { error: err.message, loading: false });
          return EMPTY;
        })
      );
    },
    updateOrder: rxMethod<{ id: string; status: OrderStatus }>(
      pipe(
        switchMap(({ id, status }) =>
          apollo.mutate<{
            updateOrder: OrderWithItems;
          }>({
            mutation: UPDATE_ORDER,
            variables: {
              id,
              status,
            },
          })
        )
      )
    ),
    removeUnpaidOrder: rxMethod<string>(
      pipe(
        switchMap((id) =>
          apollo.mutate<{
            updateOrder: OrderWithItems;
          }>({
            mutation: DELETE_UNPAID_ORDER,
            variables: {
              id,
            },
          })
        ),
        tap({
          next: ({ data }) => {
            console.log('Unpaid order deleted', { data });
            patchState(store, { error: null });
          },
          error: (error) => patchState(store, { error: error.message }),
        })
      )
    ),
    setError(error: string) {
      patchState(store, {
        error,
      });
    },
  }))
);
