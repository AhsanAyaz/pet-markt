import { isPlatformServer } from '@angular/common';
import {
  inject,
  Injectable,
  OnDestroy,
  PLATFORM_ID,
  REQUEST,
} from '@angular/core';
import {
  Auth,
  beforeAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  user,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import cookies from 'js-cookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  auth = inject(Auth);
  router = inject(Router);
  platformId = inject(PLATFORM_ID);
  currentUser$ = user(this.auth);
  idToken = '';
  cookieKey = '__pm_session';
  unsubscribeFromOnIdTokenChanged: (() => void) | undefined;
  unsubscribeFromBeforeAuthStateChanged: (() => void) | undefined;

  constructor() {
    if (isPlatformServer(this.platformId)) {
      // set up server auth
      this.setUpServerAuth();
    } else {
      // set up browser auth
      this.setUpBrowserAuth();
    }
  }

  setUpServerAuth() {
    const request = inject(REQUEST);
    const requestHeaders = request?.headers;
    const cookieHeader = requestHeaders?.get('cookie');
    let authIdToken: string | undefined;

    if (cookieHeader) {
      // 'pm_session=1234;uId=asdjklj;'
      const cookiePairs = cookieHeader.split(';');
      for (const pair of cookiePairs) {
        const [key, value] = pair.trim().split('=');
        if (key === this.cookieKey) {
          authIdToken = value;
          break;
        }
      }
    }

    if (authIdToken) {
      this.idToken = authIdToken;
      this.handleCookie(this.idToken);
    } else {
      this.handleCookie();
    }
  }

  setUpBrowserAuth() {
    this.unsubscribeFromOnIdTokenChanged = onIdTokenChanged(
      this.auth,
      async (user) => {
        const token = await user?.getIdToken();
        this.handleCookie(token);
      }
    );

    let priorCookieValue: string | undefined; // step 1
    this.unsubscribeFromBeforeAuthStateChanged = beforeAuthStateChanged(
      this.auth,
      async (user) => {
        priorCookieValue = cookies.get(this.cookieKey); // step 2 (save temp)
        const token = await user?.getIdToken();
        this.handleCookie(token); // step 3
      },
      async () => {
        this.handleCookie(priorCookieValue); // step 4 rollback
      }
    );

    this.idToken = cookies.get(this.cookieKey) || '';
  }

  handleCookie(token?: string) {
    if (token) {
      cookies.set(this.cookieKey, token);
    } else {
      cookies.remove(this.cookieKey);
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (e) {
      console.error('Login error: ', e);
      throw e;
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
      console.error(`Signup error:`, error);
      throw error;
    }
  }

  async getToken() {
    let token: string | null = null;
    const user = this.auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    } else if (this.idToken) {
      token = this.idToken;
    }
    console.log('token from getToken() method:', token);
    return token;
  }

  async googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error(`Google sign in error:`, error);
      throw error;
    }
  }
  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error(`Logout error:`, error);
      throw error;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromOnIdTokenChanged?.();
    this.unsubscribeFromBeforeAuthStateChanged?.();
  }
}
