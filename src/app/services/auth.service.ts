import { Injectable, inject } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);
  currentUser$ = user(this.auth);

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
}
