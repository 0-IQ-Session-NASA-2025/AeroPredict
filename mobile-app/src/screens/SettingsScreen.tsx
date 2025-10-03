import React from 'react';
import {View, Text} from 'react-native';
import {commonStyles} from '../styles/commonStyles';

const SettingsScreen: React.FC = () => (
  <View style={commonStyles.screenContainer}>
    <Text style={commonStyles.screenTitle}>Settings</Text>
    <Text style={commonStyles.screenContent}>
      App settings and preferences.
    </Text>
  </View>
);

export default SettingsScreen;
