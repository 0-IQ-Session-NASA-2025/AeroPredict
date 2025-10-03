export interface UserProfile {
  id: string;
  age: number;
  healthConditions: string[];
  activityLevel: 'low' | 'moderate' | 'high';
  location: LocationData;
  preferences: {
    notifications: boolean;
    alertThreshold: number;
    preferredUnits: 'metric' | 'imperial';
  };
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  status: string;
  lastUpdated: string;
  healthRisk: 'low' | 'moderate' | 'high' | 'very-high';
  predictions: PredictionData[];
}

export interface PredictionData {
  timestamp: string;
  aqi: number;
  confidence: number;
}

export interface RouteData {
  id: string;
  origin: LocationData;
  destination: LocationData;
  routes: RouteOption[];
}

export interface RouteOption {
  id: string;
  path: LocationData[];
  avgAqi: number;
  duration: number;
  distance: number;
  exposureRisk: 'low' | 'moderate' | 'high';
}

export interface CommunityReport {
  id: string;
  location: LocationData;
  reportedBy: string;
  type: 'air-quality' | 'pollution-source' | 'weather';
  description: string;
  severity: number;
  timestamp: string;
  verified: boolean;
}

export interface EconomicImpact {
  healthcareCosts: number;
  productivityLoss: number;
  environmentalDamage: number;
  cleanAirBenefits: number;
  totalImpact: number;
}

export interface StakeholderDashboard {
  type: 'health' | 'policy' | 'emergency' | 'economic' | 'community';
  data: any;
  widgets: DashboardWidget[];
}

export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: any;
  size: 'small' | 'medium' | 'large';
}

export interface EmergencyAlert {
  id: string;
  type: 'wildfire' | 'industrial-accident' | 'high-pollution';
  severity: 'warning' | 'alert' | 'emergency';
  location: LocationData;
  affectedRadius: number;
  message: string;
  recommendations: string[];
  timestamp: string;
}

export interface AIAssistantMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  attachments?: {
    type: 'chart' | 'map' | 'report';
    data: any;
  }[];
}
