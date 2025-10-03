import React from 'react';
import {View, Text} from 'react-native';
import {commonStyles} from '../styles/commonStyles';

const AboutScreen: React.FC = () => (
  <View style={commonStyles.screenContainer}>
    <Text style={commonStyles.screenTitle}>About</Text>
    <Text style={commonStyles.screenContent}>
      Information about AeroPredict app and its features.
    </Text>
  </View>
);

export default AboutScreen;
