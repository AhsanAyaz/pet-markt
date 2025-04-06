import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: async () => {
      const mod = await import('./home/home.component');
      return mod.HomeComponent;
    },
  },
  {
    path: 'products',
    loadComponent: async () => {
      const mod = await import('./products/products.component');
      return mod.ProductsComponent;
    },
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./auth/login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'auth/signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((c) => c.SignupComponent),
  },
  {
    path: 'cart',
    loadComponent: async () => {
      const mod = await import('./cart/cart.component');
      return mod.CartComponent;
    },
  },
  {
    path: 'checkout',
    loadComponent: async () => {
      const mod = await import('./checkout/checkout.component');
      return mod.CheckoutComponent;
    },
  },
  {
    path: 'checkout/cancel',
    loadComponent: async () => {
      const mod = await import(
        './checkout/checkout-failure/checkout-failure.component'
      );
      return mod.CheckoutFailureComponent;
    },
  },
  {
    path: 'checkout/success',
    loadComponent: async () => {
      const mod = await import(
        './checkout/checkout-success/checkout-success.component'
      );
      return mod.CheckoutSuccessComponent;
    },
  },
  {
    path: 'orders',
    loadComponent: async () => {
      const mod = await import('./orders/orders.component');
      return mod.OrdersComponent;
    },
  },
  {
    path: 'orders/:id',
    loadComponent: async () => {
      const mod = await import('./order/order.component');
      return mod.OrderComponent;
    },
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
