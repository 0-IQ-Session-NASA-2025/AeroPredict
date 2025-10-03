import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import '@react-native-firebase/app';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import Tts from 'react-native-tts';
import {getFCMToken} from '../services/pushNotification';
import {registerFcmToken} from '../utils/api';
import {apiFetch} from '../utils/network';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationContextType {
  notificationId: string;
  setNotificationId: (status: string) => void;
}

const NotificationContext = createContext(
  null as unknown as NotificationContextType,
);

export const NotificationProvider: React.FC<{children: ReactNode}> = ({
  children,
}) => {
  // push notification
  const [notificationId, setNotificationId] = useState('');

  // notifee configuration
  const channelId = 'aero-predict';
  const channelName = 'Aero Predict';

  async function requestUserPermissionForFcm() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    return enabled;
  }

  async function onMessageReceived(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    const title = remoteMessage?.notification?.title ?? '';
    const body = remoteMessage?.notification?.body ?? '';

    // Display a notification
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });

    // Read notification aloud for accessibility
    if (title || body) {
      const textToSpeak = title
        ? (body ? `${title}. ${body}` : title)
        : body;

      try {
        // Configure TTS settings for better accessibility
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5); // Slower speech rate for better comprehension
        Tts.setDefaultPitch(1.0);

        // Speak the notification
        Tts.speak(textToSpeak);
      } catch (error) {
        console.log('TTS Error:', error);
      }
    }
  }

  // start remote message listener and remote message action for firebase push notification
  // set notificationReceived as true when received remote message
  useEffect(() => {
    const startFirebaseMessaging = async () => {
      console.log('Starting Firebase messaging setup...');
      try {
        // request for fcm token permission
        console.log('Requesting FCM permission...');
        await requestUserPermissionForFcm();
        console.log('FCM permission request completed');

        console.log('About to get FCM token...');
        const fcmToken = await getFCMToken();
        console.log('------>>>> fcm token: ', fcmToken);

        const response = await apiFetch(registerFcmToken, 'POST', {
          token: fcmToken,
          userId: null,
          deviceInfo: {
            platform: Platform.OS,
            deviceId: 'device-unique-id', // Use a device ID library
            appVersion: '1.0.0',
          },
        });

        if (fcmToken && response.success) {
          await AsyncStorage.setItem('aeroPredictFcmToken', fcmToken);
        }

        await messaging().registerDeviceForRemoteMessages();

        await notifee.requestPermission();

        // Create a channel (required for Android)
        notifee.isChannelCreated(channelId).then(isCreated => {
          if (!isCreated) {
            notifee.createChannel({
              id: channelId,
              name: channelName,
              sound: 'default',
            });
          }
        });

        notifee.onForegroundEvent(({type, detail}) => {
          switch (type) {
            case EventType.DISMISSED: {
              //User dismiss notification that received in foreground
              console.log('Notification dismissed');
              break;
            }
            case EventType.PRESS: {
              const type = detail?.notification?.data?.type;
              switch (type) {
                case 'missedAlarams':
                  //navigate user to any screen on UI
                  break;
                default:
                  break;
              }
              break;
            }
          }
        });

        messaging().onMessage(async remoteMessage => {
          // Alert.alert('A new FCM message arrived in foreground!', JSON.stringify(remoteMessage));
          onMessageReceived(remoteMessage);
          setNotificationId(`${remoteMessage.messageId}`);
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
          onMessageReceived(remoteMessage);
          setNotificationId(`${remoteMessage.messageId}`);
        });
      } catch (error) {
        console.error('Error in Firebase messaging setup:', error);
      }
    };
    startFirebaseMessaging();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notificationId,
        setNotificationId,
      }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
