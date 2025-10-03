import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {colors} from '../../styles/commonStyles';
import {MENU_ITEMS} from '../../constants/menuItems';

interface CustomDrawerProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({navigation}) => {
  return (
    <SafeAreaView style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>AeroPredict</Text>
        <Text style={styles.drawerSubtitle}>Air Quality Monitor</Text>
      </View>

      <ScrollView style={styles.drawerContent}>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.drawerItem}
            onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.drawerIcon}>{item.icon}</Text>
            <Text style={styles.drawerItemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  drawerHeader: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 40,
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  drawerSubtitle: {
    fontSize: 14,
    color: '#e8f5e8',
    marginTop: 5,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  drawerIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  drawerItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

export default CustomDrawer;
