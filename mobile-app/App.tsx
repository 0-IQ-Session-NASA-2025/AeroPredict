import React from 'react';
import {AuthProvider} from './src/contexts/authContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {PredictionTimeProvider} from './src/contexts/PredictionTimeContext';
import {AirPollutionProvider} from './src/contexts/AirPollutionContext';
import {NotificationProvider} from './src/contexts/notificationContext';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <PredictionTimeProvider>
        <AirPollutionProvider>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </AirPollutionProvider>
      </PredictionTimeProvider>
    </NotificationProvider>
  );
};

export default App;
