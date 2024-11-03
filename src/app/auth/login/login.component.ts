import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  async onSubmit() {
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async loginWithGoogle() {
    try {
      await this.auth.googleSignIn();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Google login error:', error);
    }
  }
}
