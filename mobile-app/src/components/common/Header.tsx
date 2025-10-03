import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../styles/commonStyles';

interface HeaderProps {
  title: string;
  onMenuPress: () => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onMenuPress,
  showBackButton,
  onBackPress,
}) => {
  return (
    <View style={styles.header}>
      {showBackButton ? (
        <TouchableOpacity style={styles.menuButton} onPress={onBackPress}>
          <Text style={styles.menuIcon}>←</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuButton: {
    padding: 10,
  },
  menuIcon: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  placeholder: {
    width: 40,
  },
});

export default Header;
