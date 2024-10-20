import { Component, inject } from '@angular/core';
import { CartStore } from '../../store/cart.store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  cartStore = inject(CartStore);
}
