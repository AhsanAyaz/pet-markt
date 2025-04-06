import { isPlatformBrowser } from '@angular/common';
import {
  Injectable,
  PLATFORM_ID,
  REQUEST,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  user,
  beforeAuthStateChanged,
  onIdTokenChanged,
} from '@angular/fire/auth';
import cookies from 'js-cookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  auth = inject(Auth);
  idToken = '';
  private unsubscribeFromOnIdTokenChanged: (() => void) | undefined;
  private unsubscribeFromBeforeAuthStateChanged: (() => void) | undefined;
  currentUser$ = user(this.auth);

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      this.setupBrowserAuth();
    } else {
      this.setupServerAuth();
    }
  }

  /**
   * Handles cookie operations
   * @param token - Optional token to set, removes cookie if undefined
   */
  private handleCookie(token?: string) {
    if (token) {
      cookies.set('__session', token);
    } else {
      cookies.remove('__session');
    }
  }

  /**
   * Sets up auth state listeners for browser environment
   */
  private setupBrowserAuth() {
    this.unsubscribeFromOnIdTokenChanged = onIdTokenChanged(
      this.auth,
      async (user) => {
        const token = await user?.getIdToken();
        this.handleCookie(token);
      }
    );

    let priorCookieValue: string | undefined;
    this.unsubscribeFromBeforeAuthStateChanged = beforeAuthStateChanged(
      this.auth,
      async (user) => {
        priorCookieValue = cookies.get('__session');
        const token = await user?.getIdToken();
        this.handleCookie(token);
      },
      async () => {
        // If another beforeAuthStateChanged rejects, revert the cookie
        this.handleCookie(priorCookieValue);
      }
    );

    this.idToken = cookies.get('__session') || '';
  }

  /**
   * Sets up auth state for server environment
   */
  private setupServerAuth() {
    const request = inject(REQUEST);
    const requestHeaders = request?.headers;
    console.log({ requestHeaders });

    const cookieHeader = requestHeaders?.get('cookie');
    let authIdToken: string | undefined;

    if (cookieHeader) {
      const cookiePairs = cookieHeader.split(';');
      for (const pair of cookiePairs) {
        const [key, value] = pair.trim().split('=');
        if (key === '__session') {
          authIdToken = value;
          break;
        }
      }
    }

    if (authIdToken) {
      this.idToken = authIdToken;
      console.log('set token on the server', this.idToken);
      this.handleCookie(authIdToken);
    } else {
      this.handleCookie();
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeFromBeforeAuthStateChanged?.();
    this.unsubscribeFromOnIdTokenChanged?.();
  }

  async login(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return result.user;
    } catch (error) {
      console.error(`Login error:`, error);
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
      console.error(`Signup error:`, error);
      throw error;
    }
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

  async getToken(): Promise<string | null> {
    let token: string | null = null;
    const user = this.auth.currentUser;
    if (user) {
      token = await user.getIdToken();
    } else if (this.idToken) {
      token = this.idToken;
    }
    console.log('\nsending back token: ', token);
    return token;
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.handleCookie();
      this.idToken = '';
    } catch (error) {
      console.error(`Logout error:`, error);
      throw error;
    }
  }
}
