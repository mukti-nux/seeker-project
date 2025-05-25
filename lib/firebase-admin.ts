import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: 'https://console.firebase.google.com/u/2/project/seeker-projectku/database/seeker-projectku-default-rtdb/data/~2F',
  });
}

export const db = getDatabase();
