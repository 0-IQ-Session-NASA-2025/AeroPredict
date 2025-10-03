import React, {useState} from 'react';
import {SafeAreaView, StatusBar, ScrollView} from 'react-native';
import Header from '../components/common/Header';
import WelcomeSection from '../components/home/WelcomeSection';
import CurrentAirQuality from '../components/home/CurrentAirQuality';
import QuickActions from '../components/home/QuickActions';
import NearbyLocations from '../components/home/NearbyLocations';
import SlideMenu from '../components/navigation/SlideMenu';
import {commonStyles, colors} from '../styles/commonStyles';
import {NavigationProps} from '../types';
import {MOCK_AIR_QUALITY_DATA} from '../constants/menuItems';

const HomeScreen: React.FC<NavigationProps> = ({navigation}) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setIsMenuVisible(true);
  };

  const handleMenuClose = () => {
    setIsMenuVisible(false);
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.primary} />

      <Header title="AeroPredict" onMenuPress={handleMenuPress} />

      <ScrollView style={styles.content}>
        <WelcomeSection />

        <CurrentAirQuality
          aqi={78}
          status="Moderate"
          lastUpdated="Last updated: 2 minutes ago"
        />

        <QuickActions />

        <NearbyLocations locations={MOCK_AIR_QUALITY_DATA} />
      </ScrollView>

      <SlideMenu
        isVisible={isMenuVisible}
        onClose={handleMenuClose}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = {
  content: {
    flex: 1,
    padding: 15,
  },
};

export default HomeScreen;
