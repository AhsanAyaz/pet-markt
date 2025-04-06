import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import serviceACcount from '../../../service-account.json';

@Injectable()
export class FirebaseService implements OnModuleInit {
  onModuleInit() {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceACcount as admin.ServiceAccount
        ),
      });
    }
  }

  async verifyToken(token: string): Promise<string | undefined> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken.uid;
    } catch (error) {
      console.error('Token verification failed:', error);
      return undefined;
    }
  }
}
