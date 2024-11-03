import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideApollo } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/cache';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { HttpLink } from 'apollo-angular/http';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideNgxStripe } from 'ngx-stripe';
import { environment } from '../environments/environment';

const firebaseConfig = {
  apiKey: 'AIzaSyC-DiQ0cstOSnqG3DPt8OPfgYuPvT-4QC0',
  authDomain: 'pet-markt.firebaseapp.com',
  projectId: 'pet-markt',
  storageBucket: 'pet-markt.firebasestorage.app',
  messagingSenderId: '90352173504',
  appId: '1:90352173504:web:6df04c07c88125a4140825',
  measurementId: 'G-HZ5K6MDCRT',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: '/graphql' }),
        cache: new InMemoryCache(),
      };
    }),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideNgxStripe(environment.stripePublicKey),
  ],
};
