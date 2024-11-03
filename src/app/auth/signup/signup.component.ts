import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  async onSubmit() {
    try {
      await this.auth.signup(this.email, this.password);
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Signup error:', error);
    }
  }

  async signupWithGoogle() {
    try {
      await this.auth.googleSignIn();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Google signup error:', error);
    }
  }
}
