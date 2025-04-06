import {
  mergeApplicationConfig,
  ApplicationConfig,
  inject,
  REQUEST,
} from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import {
  FirebaseApp,
  initializeServerApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import { environment } from './environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    provideFirebaseApp(() => {
      const request = inject(REQUEST);
      const requestHeaders = request?.headers;
      console.log({ requestHeaders });

      // Access the cookie header directly from the headers object
      const cookieHeader = requestHeaders?.get('cookie');
      let authIdToken: string | undefined;

      if (cookieHeader) {
        // Robustly parse cookies, in case there are multiple
        const cookiePairs = cookieHeader.split(';');
        for (const pair of cookiePairs) {
          const [key, value] = pair.trim().split('=');
          if (key === '__session') {
            authIdToken = value;
            break;
          }
        }
      }

      console.log({ authIdToken });
      return initializeServerApp(
        {
          ...environment.firebase,
          name: 'server',
        },
        { authIdToken }
      );
    }),
    provideAuth(() => getAuth(inject(FirebaseApp))),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
