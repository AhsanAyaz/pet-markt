import { Route } from '@angular/router';
import { authGuard } from './auth/auth.guard';

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
    path: 'orders',
    loadComponent: () =>
      import('./orders/orders.component').then((c) => c.OrdersComponent),
    canActivate: [authGuard],
  },
  {
    path: 'orders/:id',
    loadComponent: () =>
      import('./order/order.component').then((c) => c.OrderComponent),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
