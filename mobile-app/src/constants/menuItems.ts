import { MenuItem } from '../types';


export const MENU_ITEMS: MenuItem[] = [
  { name: 'Home', screen: 'Home', icon: '🏠' },
  { name: 'Air Quality Prediction', screen: 'Prediction', icon: '📊' },
  { name: 'Air Quality Map', screen: 'Map', icon: '🗺️' },
  { name: 'Historical Data', screen: 'History', icon: '📈' },
  { name: 'Settings', screen: 'Settings', icon: '⚙️' },
  { name: 'About', screen: 'About', icon: 'ℹ️' },
];


export const MOCK_AIR_QUALITY_DATA = [
  { location: 'Downtown', aqi: 85, status: 'Moderate' },
  { location: 'Suburbs', aqi: 45, status: 'Good' },
  { location: 'Industrial Area', aqi: 152, status: 'Unhealthy' },
];
