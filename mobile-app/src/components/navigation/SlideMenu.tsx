import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {colors} from '../../styles/commonStyles';
import {MENU_ITEMS} from '../../constants/menuItems';

// const {width} = Dimensions.get('window');
const MENU_WIDTH = 280;

interface SlideMenuProps {
  isVisible: boolean;
  onClose: () => void;
  navigation: {
    navigate: (screen: string) => void;
  };
}

const SlideMenu: React.FC<SlideMenuProps> = ({
  isVisible,
  onClose,
  navigation,
}) => {
  const slideAnimation = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      // Show menu
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnimation, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide menu
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: -MENU_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnimation, overlayAnimation]);

  const handleNavigate = (screen: string) => {
    onClose();
    navigation.navigate(screen);
  };

  if (!isVisible) {return null;}

  return (
    <View style={styles.container}>
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: overlayAnimation,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Menu */}
      <Animated.View
        style={[
          styles.menu,
          {
            transform: [{translateX: slideAnimation}],
          },
        ]}>
        {/* Header */}
        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>AeroPredict</Text>
          <Text style={styles.menuSubtitle}>Air Quality Monitor</Text>
        </View>

        {/* Menu Items */}
        <ScrollView style={styles.menuContent}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleNavigate(item.screen)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuItemText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: MENU_WIDTH,
    backgroundColor: colors.white,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  menuHeader: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#e8f5e8',
    marginTop: 5,
  },
  menuContent: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});

export default SlideMenu;
