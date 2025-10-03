import admin from 'firebase-admin';
import { Logger } from '../utils/logger';

const logger = Logger.getInstance();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    });
    logger.info('Firebase Admin SDK initialized successfully');
  }
} catch (error) {
  logger.error('Error initializing Firebase Admin SDK: '+ error);
}

export const sendPushNotification = async (fcmTokens: string[], title: string, body: string) => {
  try {

    const message = {
      tokens : fcmTokens,
      notification: {
        title,
        body
      },
    }

    // Send messages in batches of 500 (Firebase limit)
    await admin.messaging().sendEachForMulticast(message);
    // while (messages.length) {
    //   const batch = messages.splice(0, 500);
    //   await admin.messaging().sendEach(batch);
    // }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};