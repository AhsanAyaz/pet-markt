import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout-failure',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './checkout-failure.component.html',
  styleUrl: './checkout-failure.component.scss',
})
export class CheckoutFailureComponent {}
