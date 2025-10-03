import React from 'react';
import {View, Text} from 'react-native';
import {commonStyles} from '../styles/commonStyles';

const HistoryScreen: React.FC = () => (
  <View style={commonStyles.screenContainer}>
    <Text style={commonStyles.screenTitle}>Historical Data</Text>
    <Text style={commonStyles.screenContent}>
      Historical air quality data and trends.
    </Text>
  </View>
);

export default HistoryScreen;
