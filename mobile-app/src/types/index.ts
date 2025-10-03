export interface AirQualityData {
  location: string;
  aqi: number;
  status: string;
}

export interface MenuItem {
  name: string;
  screen: string;
  icon: string;
}

export interface NavigationProps {
  navigation: {
    navigate: (screen: string) => void;
    goBack: () => void;
  };
}

export interface QuickAction {
  icon: string;
  text: string;
  onPress: () => void;
}
