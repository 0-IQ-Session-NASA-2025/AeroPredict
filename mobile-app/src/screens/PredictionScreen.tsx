import React from 'react';
import {View, Text} from 'react-native';
import {commonStyles} from '../styles/commonStyles';

const PredictionScreen: React.FC = () => (
  <View style={commonStyles.screenContainer}>
    <Text style={commonStyles.screenTitle}>Air Quality Prediction</Text>
    <Text style={commonStyles.screenContent}>
      Prediction models and forecasts will be displayed here.
    </Text>
  </View>
);

export default PredictionScreen;
