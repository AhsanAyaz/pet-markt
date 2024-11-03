import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then((c) => c.HomeComponent),
    title: 'Home',
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products.component').then((c) => c.ProductsComponent),
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
    loadComponent: () =>
      import('./cart/cart.component').then((c) => c.CartComponent),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./checkout/checkout.component').then((c) => c.CheckoutComponent),
  },
  {
    path: 'checkout/success',
    loadComponent: () =>
      import('./checkout/checkout-success/checkout-success.component').then(
        (c) => c.CheckoutSuccessComponent
      ),
  },
  {
    path: 'checkout/cancel',
    loadComponent: () =>
      import('./checkout/checkout-failure/checkout-failure.component').then(
        (c) => c.CheckoutFailureComponent
      ),
  },
];
