import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Card from '../common/Card';
import {colors} from '../../styles/commonStyles';
import {QuickAction} from '../../types';

interface QuickActionsProps {
  actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
  {
    icon: '📊',
    text: 'View Prediction',
    onPress: () => Alert.alert('Prediction', 'Opening prediction view...'),
  },
  {
    icon: '🗺️',
    text: 'Air Quality Map',
    onPress: () => Alert.alert('Map', 'Opening air quality map...'),
  },
  {
    icon: '📈',
    text: 'Historical Data',
    onPress: () => Alert.alert('History', 'Opening historical data...'),
  },
  {
    icon: '🔔',
    text: 'Set Alerts',
    onPress: () => Alert.alert('Alerts', 'Opening alert settings...'),
  },
];

const QuickActions: React.FC<QuickActionsProps> = ({
  actions = defaultActions,
}) => {
  return (
    <Card title="Quick Actions">
      <View style={styles.actionGrid}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionButton}
            onPress={action.onPress}>
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionText}>{action.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

export default QuickActions;
