import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {colors, commonStyles} from '../styles/commonStyles';
import HealthRiskProfileCard from '../components/airguard/HealthRiskProfileCard';
import AirCorridorMap from '../components/airguard/AirCorridorMap';
import CommunitySentinel from '../components/airguard/CommunitySentinel';
import StakeholderDashboard from '../components/airguard/StakeholderDashboard';
import EconomicImpactCard from '../components/airguard/EconomicImpactCard';
import AIAssistant from '../components/airguard/AIAssistant';
import CurrentAirQuality from '../components/home/CurrentAirQuality';
import {
  UserProfile,
  AirQualityData,
  LocationData,
  RouteOption,
  CommunityReport,
} from '../types/airGuard';
import PredictionTimePicker from '../components/common/PredictionTimePicker';

const AirGuardProHomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [dashboardType, setDashboardType] = useState<
    'health' | 'policy' | 'emergency' | 'economic' | 'community'
  >('health');
  const [economicTimeframe, setEconomicTimeframe] = useState<
    'daily' | 'monthly' | 'yearly'
  >('monthly');

  // Mock data
  const currentLocation: LocationData = {
    latitude: 37.7749,
    longitude: -122.4194,
    address: 'San Francisco, CA',
  };

  const mockUserProfile: UserProfile = {
    id: 'user-1',
    age: 28,
    healthConditions: ['asthma'],
    activityLevel: 'moderate',
    location: currentLocation,
    preferences: {
      notifications: true,
      alertThreshold: 100,
      preferredUnits: 'metric',
    },
  };

  const mockAirQuality: AirQualityData = {
    aqi: 78,
    pm25: 35.2,
    pm10: 42.1,
    o3: 68.5,
    no2: 28.3,
    so2: 12.7,
    co: 1.2,
    status: 'Moderate',
    lastUpdated: '2 minutes ago',
    healthRisk: 'moderate',
    predictions: [
      {timestamp: '1h', aqi: 82, confidence: 0.85},
      {timestamp: '3h', aqi: 75, confidence: 0.78},
      {timestamp: '6h', aqi: 68, confidence: 0.72},
    ],
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleRouteSelection = (route: RouteOption) => {
    console.log('Selected route:', route);
  };

  const handleReportSubmit = (report: CommunityReport) => {
    console.log('Report submitted:', report);
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    console.log('Profile updated:', profile);
  };

  const handleAIMessage = (message: string) => {
    console.log('AI message:', message);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            {/* Current Air Quality */}
            <CurrentAirQuality
              aqi={mockAirQuality.aqi}
              status={mockAirQuality.status}
              lastUpdated={mockAirQuality.lastUpdated}
            />

            <PredictionTimePicker showCard={true} compact={false} />

            {/* Health Risk Profile */}
            {/* <HealthRiskProfileCard
              userProfile={mockUserProfile}
              airQuality={mockAirQuality}
              onUpdateProfile={handleUpdateProfile}
            /> */}

            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => setActiveTab('routes')}>
                <Text style={styles.quickActionIcon}>🗺️</Text>
                <Text style={styles.quickActionText}>Smart Routes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => setActiveTab('community')}>
                <Text style={styles.quickActionIcon}>👥</Text>
                <Text style={styles.quickActionText}>Community</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => setActiveTab('ai')}>
                <Text style={styles.quickActionIcon}>🤖</Text>
                <Text style={styles.quickActionText}>AI Assistant</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickAction}
                onPress={() => setActiveTab('analytics')}>
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Analytics</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'routes':
        return (
          <View style={styles.tabContent}>
            <AirCorridorMap
              currentLocation={currentLocation}
              onRouteSelected={handleRouteSelection}
            />
          </View>
        );

      case 'community':
        return (
          <View style={styles.tabContent}>
            <CommunitySentinel
              currentLocation={currentLocation}
              onReportSubmit={handleReportSubmit}
            />
          </View>
        );

      case 'dashboards':
        return (
          <View style={styles.tabContent}>
            <StakeholderDashboard
              dashboardType={dashboardType}
              airQualityData={mockAirQuality}
              onDashboardChange={setDashboardType}
            />
          </View>
        );

      case 'economics':
        return (
          <View style={styles.tabContent}>
            <EconomicImpactCard
              timeframe={economicTimeframe}
              onTimeframeChange={setEconomicTimeframe}
            />
          </View>
        );

      case 'ai':
        return (
          <View style={styles.tabContent}>
            <AIAssistant
              airQualityData={mockAirQuality}
              onMessageSend={handleAIMessage}
            />
          </View>
        );

      case 'analytics':
        return (
          <View style={styles.tabContent}>
            {/* Quick Analytics Overview */}
            <View style={styles.analyticsGrid}>
              <TouchableOpacity
                style={styles.analyticsTile}
                onPress={() => setActiveTab('dashboards')}>
                <Text style={styles.analyticsIcon}>🏥</Text>
                <Text style={styles.analyticsTitle}>Health Dashboard</Text>
                <Text style={styles.analyticsSubtitle}>
                  Risk analysis & alerts
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.analyticsTile}
                onPress={() => {
                  setDashboardType('policy');
                  setActiveTab('dashboards');
                }}>
                <Text style={styles.analyticsIcon}>📊</Text>
                <Text style={styles.analyticsTitle}>Policy Impact</Text>
                <Text style={styles.analyticsSubtitle}>
                  Regulatory compliance
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.analyticsTile}
                onPress={() => {
                  setDashboardType('emergency');
                  setActiveTab('dashboards');
                }}>
                <Text style={styles.analyticsIcon}>🚨</Text>
                <Text style={styles.analyticsTitle}>Emergency Response</Text>
                <Text style={styles.analyticsSubtitle}>Crisis management</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.analyticsTile}
                onPress={() => setActiveTab('economics')}>
                <Text style={styles.analyticsIcon}>💰</Text>
                <Text style={styles.analyticsTitle}>Economic Impact</Text>
                <Text style={styles.analyticsSubtitle}>
                  Cost-benefit analysis
                </Text>
              </TouchableOpacity>
            </View>

            {/* Trending Insights */}
            <View style={styles.insightsContainer}>
              <Text style={styles.insightsTitle}>🔥 Trending Insights</Text>
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  Air quality improved 15% this week due to reduced traffic
                </Text>
                <Text style={styles.insightTime}>2 hours ago</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  Industrial emissions down 22% following new regulations
                </Text>
                <Text style={styles.insightTime}>1 day ago</Text>
              </View>
              <View style={styles.insightItem}>
                <Text style={styles.insightText}>
                  Community reports accuracy increased to 94%
                </Text>
                <Text style={styles.insightTime}>3 days ago</Text>
              </View>
            </View>
          </View>
        );

      default:
        return <View style={styles.tabContent} />;
    }
  };

  const tabs = [
    {id: 'overview', label: 'Overview', icon: '🏠'},
    {id: 'routes', label: 'Routes', icon: '🗺️'},
    {id: 'analytics', label: 'Analytics', icon: '📊'},
    {id: 'community', label: 'Community', icon: '👥'},
    {id: 'ai', label: 'AI Assistant', icon: '🤖'},
  ];

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Aero Predict</Text>
        <Text style={styles.headerSubtitle}>
          Comprehensive Air Quality Intelligence
        </Text>
      </View>

      {/* Tab Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabNavigation}
        contentContainerStyle={styles.tabNavigationContent}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabButton,
              activeTab === tab.id && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab.id)}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id && styles.activeTabLabel,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content Area */}
      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {renderTabContent()}
      </ScrollView>

      {/* Emergency Alert Bar (conditional) */}
      {mockAirQuality.aqi > 150 && (
        <View style={styles.emergencyBar}>
          <Text style={styles.emergencyText}>
            🚨 High pollution alert - Limit outdoor activities
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingVertical: 20,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    opacity: 0.9,
  },
  tabNavigation: {
    flexGrow: 0,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginTop: 10,
  },
  tabNavigationContent: {
    paddingHorizontal: 10,
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
    minWidth: 80,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: colors.white,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContent: {
    padding: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  quickAction: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  analyticsTile: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  analyticsIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  analyticsSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  insightsContainer: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  insightItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  insightText: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  insightTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  emergencyBar: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emergencyText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default AirGuardProHomeScreen;
