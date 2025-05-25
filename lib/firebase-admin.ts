import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://seeker-projectku-default-rtdb.asia-southeast1.firebasedatabase.app',
  });
}

export const db = getDatabase();
