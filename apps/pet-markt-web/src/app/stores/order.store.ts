import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Order, OrderItem, OrderStatus, Product } from '@prisma/client';
import { Apollo, gql } from 'apollo-angular';
import { map, tap } from 'rxjs';

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

export type OrderItemWithProduct = OrderItem & {
  product: Product;
};

export type OrderWithItems = Order & {
  items: OrderItemWithProduct[];
};

type OrderState = {
  orders: OrderWithItems[];
  orderDetail: OrderWithItems | null;
  error: string | null;
};

const initialState: OrderState = {
  orders: [],
  orderDetail: null,
  error: null,
};

export const OrderStore = signalStore(
  {
    providedIn: 'root',
  },
  withState(() => initialState),
  withMethods((store, apollo = inject(Apollo)) => ({
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
    setError(error: string) {
      patchState(store, {
        error,
      });
    },
  }))
);
