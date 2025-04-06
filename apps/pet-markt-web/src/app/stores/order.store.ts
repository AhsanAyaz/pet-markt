import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Order, OrderItem, OrderStatus, Product } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { catchError, EMPTY, from, map, switchMap, tap } from 'rxjs';
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

const DELETE_UNPAID_ORDER = gql`
  mutation RemoveOrder($id: String!) {
    removeOrder(id: $id) {
      orderId
      success
      error
    }
  }
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrderStatus($id: String!, $status: OrderStatus!) {
    updateOrder(updateOrderInput: { id: $id, status: $status }) {
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
    getOrder(id: string, token: string | null) {
      patchState(store, { loading: true, error: null });
      return apollo
        .query<{ order: OrderWithItems }>({
          query: GET_ORDER,
          variables: {
            id,
            token,
          },
        })
        .pipe(
          tap({
            next: ({ data }) =>
              patchState(store, { loading: true, orderDetail: data.order }),
            error: (error) =>
              patchState(store, { loading: true, error: error.message }),
          }),
          map(({ data }) => data.order)
        );
    },
    deleteUnpaidOrder(id: string) {
      patchState(store, { error: null });
      return apollo
        .mutate<{ order: OrderWithItems }>({
          mutation: DELETE_UNPAID_ORDER,
          variables: {
            id,
          },
        })
        .pipe(
          tap({
            next: ({ data }) => {
              console.log('Unpaid order deleted', { data });
            },
            error: (error) => patchState(store, { error: error.message }),
          })
        );
    },
    updateOrder(id: string, status: OrderStatus) {
      patchState(store, { error: null });
      return apollo
        .mutate<{ updateOrder: OrderWithItems }>({
          mutation: UPDATE_ORDER,
          variables: {
            id,
            status,
          },
        })
        .pipe(
          tap({
            next: ({ data }) =>
              patchState(store, { orderDetail: data!.updateOrder }),
            error: (error) => patchState(store, { error: error.message }),
          })
        );
    },
    getUserOrders() {
      return from(auth.getToken()).pipe(
        switchMap((token) => {
          if (!token) {
            throw new Error('User not authenticated');
          }
          console.log('token in getUserOrders', token);
          return apollo.query<{ userOrders: OrderWithItems[] }>({
            query: GET_USER_ORDERS,
            variables: { token },
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
          patchState(store, { error: err, loading: false });
          return EMPTY;
        })
      );
    },
    setError(error: string) {
      patchState(store, {
        error,
      });
    },
  }))
);
