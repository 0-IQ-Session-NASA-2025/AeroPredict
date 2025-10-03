import { Alert, Platform } from 'react-native';
import {
  RESULTS,
  requestNotifications,
} from 'react-native-permissions';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isIos = () => Platform.OS === 'ios';
export const isAndroid = () => Platform.OS === 'android';
export const getPlatformVersion = () => Number(Platform.Version);

export const requestNotificationsPermission = (onGranted: () => void, onBlocked?: () => void) => {
  requestNotifications(['alert', 'sound', 'badge']).then(({ status }) => {
    if (status === RESULTS.GRANTED) {
      onGranted();
    } else if (onBlocked) {
      onBlocked();
    }
  });
};

export async function requestUserPermissionForFcm() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  return enabled;
}

export async function getFCMToken() {
  let fcmToken = await AsyncStorage.getItem('aeroPredictFcmToken');
  
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await AsyncStorage.setItem('aeroPredictFcmToken', fcmToken);
        // Send this token to your backend
        // await sendFCMTokenToServer(fcmToken);
        console.log('\n------>>>>> Fcm Token: ', fcmToken);
      }
    } catch (error) {
      console.log('Error getting FCM token:', error);
    }
  }
  else{
    console.log('--->>> Retrieved fcm Token: ', fcmToken);
  }

  return fcmToken;
}

// async function sendFCMTokenToServer(token: string) {
//   const email = await AsyncStorage.getItem('walletEmail');
//   try {
//     const response = await fetch('YOUR_API_URL/api/users/fcm-token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email,
//         fcmToken: token,
//       }),
//     });
//     const data = await response.json();
//     console.log('FCM token sent to server:', data);
//   } catch (error) {
//     console.log('Error sending FCM token to server:', error);
//   }
// }

// export async function notificationListener() {
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log(
//       'Notification caused app to open from background state:',
//       remoteMessage.notification,
//     );
//     // Navigate to appropriate screen based on notification
//     if (remoteMessage.data?.type === 'access_request') {
//       // Navigate to ProofAccessRequests screen
//       // You'll need to implement this navigation logic
//     }
//   });

//   // Check whether an initial notification is available
//   messaging()
//     .getInitialNotification()
//     .then(remoteMessage => {
//       if (remoteMessage) {
//         console.log(
//           'Notification caused app to open from quit state:',
//           remoteMessage.notification,
//         );
//       }
//     });

//   // Foreground message handling
//   messaging().onMessage(async remoteMessage => {
//     console.log('Received foreground message:', remoteMessage);
//     // Show local notification when app is in foreground
//     // You can use react-native-push-notification here
//   });
// }