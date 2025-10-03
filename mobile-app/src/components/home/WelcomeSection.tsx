import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {colors} from '../../styles/commonStyles';

const WelcomeSection: React.FC = () => {
  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.welcomeTitle}>Air Quality Monitor</Text>
      <Text style={styles.welcomeSubtitle}>
        Real-time air pollution prediction and monitoring
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default WelcomeSection;
