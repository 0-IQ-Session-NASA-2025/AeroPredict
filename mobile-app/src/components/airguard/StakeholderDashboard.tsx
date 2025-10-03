import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {colors} from '../../styles/commonStyles';
import Card from '../common/Card';
import {
  DashboardWidget,
  AirQualityData,
  EconomicImpact,
} from '../../types/airGuard';
import {usePredictionTime} from '../../contexts/PredictionTimeContext';
import PredictionTimePicker from '../common/PredictionTimePicker';

interface StakeholderDashboardProps {
  dashboardType: 'health' | 'policy' | 'emergency' | 'economic' | 'community';
  airQualityData: AirQualityData;
  onDashboardChange: (
    type: 'health' | 'policy' | 'emergency' | 'economic' | 'community',
  ) => void;
}

const {width} = Dimensions.get('window');

const StakeholderDashboard: React.FC<StakeholderDashboardProps> = ({
  dashboardType,
  airQualityData,
  onDashboardChange,
}) => {
  const [selectedTab, setSelectedTab] = useState(dashboardType);
  // const {formatPredictionTime, getAPITimestamp} = usePredictionTime();

  const mockEconomicData: EconomicImpact = {
    healthcareCosts: 2.4,
    productivityLoss: 1.8,
    environmentalDamage: 0.9,
    cleanAirBenefits: 5.2,
    totalImpact: -1.1,
  };

  const getDashboardConfig = (type: string) => {
    switch (type) {
      case 'health':
        return {
          title: 'Health-Focused Dashboard',
          color: '#e8f5e8',
          accent: colors.success,
          widgets: [
            {
              id: 'risk-alerts',
              type: 'alert',
              title: 'High Risk Alerts',
              data: {count: 3, trend: 'up'},
              size: 'small' as const,
            },
            {
              id: 'vulnerable-population',
              type: 'stat',
              title: 'At-Risk Population',
              data: {value: '12,450', subtitle: 'within 5km radius'},
              size: 'medium' as const,
            },
            {
              id: 'health-recommendations',
              type: 'recommendations',
              title: 'Health Precautions',
              data: [
                'Indoor air filtration recommended',
                'Limit outdoor activities for children',
                'Respiratory medication advisory active',
              ],
              size: 'large' as const,
            },
          ],
        };
      case 'policy':
        return {
          title: 'Policy & Planning Dashboard',
          color: '#e8f0ff',
          accent: colors.primary,
          widgets: [
            {
              id: 'compliance',
              type: 'gauge',
              title: 'Regulatory Compliance',
              data: {value: 78, target: 85, unit: '%'},
              size: 'medium' as const,
            },
          ],
        };
      case 'emergency':
        return {
          title: 'Emergency Response Dashboard',
          color: '#fff5f5',
          accent: '#f44336',
          widgets: [
            {
              id: 'active-alerts',
              type: 'emergency',
              title: 'Active Alerts',
              data: {level: 'warning', affected: '25,000 residents'},
              size: 'large' as const,
            },
          ],
        };
      case 'economic':
        return {
          title: 'Economic Analysis Dashboard',
          color: '#f0f8f0',
          accent: '#4caf50',
          widgets: [
            {
              id: 'cost-impact',
              type: 'financial',
              title: 'Economic Impact',
              data: mockEconomicData,
              size: 'large' as const,
            },
            {
              id: 'roi-clean-air',
              type: 'roi',
              title: 'Clean Air ROI',
              data: {value: '3.2x', period: 'annual'},
              size: 'medium' as const,
            },
            {
              id: 'business-impact',
              type: 'business',
              title: 'Business Disruption',
              data: {affected: 45, total: 200, unit: 'businesses'},
              size: 'small' as const,
            },
          ],
        };
      case 'community':
        return {
          title: 'Community Engagement Dashboard',
          color: '#fef7e0',
          accent: '#ff9800',
          widgets: [
            {
              id: 'participation',
              type: 'participation',
              title: 'Community Participation',
              data: {active: 1250, growth: '+12%'},
              size: 'medium' as const,
            },
            {
              id: 'data-quality',
              type: 'quality',
              title: 'Data Quality Score',
              data: {score: 94, trend: 'stable'},
              size: 'small' as const,
            },
            {
              id: 'local-insights',
              type: 'insights',
              title: 'Community Insights',
              data: [
                'School zones show 20% higher participation',
                'Evening reports most accurate',
                'Weekend data collection improving',
              ],
              size: 'large' as const,
            },
          ],
        };
      default:
        return {
          title: 'Dashboard',
          color: '#f0f0f0',
          accent: colors.textSecondary,
          widgets: [],
        };
    }
  };

  const config = getDashboardConfig(selectedTab);

  const renderWidget = (widget: DashboardWidget) => {
    const getWidgetStyle = () => {
      const baseStyle: any[] = [styles.widget];
      if (widget.size === 'small') {
        baseStyle.push(styles.widgetSmall);
      }
      if (widget.size === 'medium') {
        baseStyle.push(styles.widgetMedium);
      }
      if (widget.size === 'large') {
        baseStyle.push(styles.widgetLarge);
      }
      return baseStyle;
    };

    const renderWidgetContent = () => {
      switch (widget.type) {
        case 'alert':
          return (
            <View>
              <View style={styles.alertHeader}>
                <Text style={[styles.alertCount, {color: config.accent}]}>
                  {widget.data.count}
                </Text>
                <Text style={styles.trendIndicator}>
                  {widget.data.trend === 'up' ? '📈' : '📉'}
                </Text>
              </View>
              <Text style={styles.widgetSubtitle}>
                Active alerts in your area
              </Text>
            </View>
          );

        case 'stat':
          return (
            <View style={styles.statContainer}>
              <Text style={[styles.statValue, {color: config.accent}]}>
                {widget.data.value}
              </Text>
              <Text style={styles.statSubtitle}>{widget.data.subtitle}</Text>
            </View>
          );

        case 'gauge':
          return (
            <View style={styles.gaugeContainer}>
              <View style={[styles.gauge, {borderColor: config.accent}]}>
                <Text style={[styles.gaugeValue, {color: config.accent}]}>
                  {widget.data.value}
                  {widget.data.unit}
                </Text>
              </View>
              <Text style={styles.gaugeTarget}>
                Target: {widget.data.target}%
              </Text>
            </View>
          );

        case 'financial':
          const economicData = widget.data as EconomicImpact;
          return (
            <View style={styles.financialContainer}>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Healthcare Costs</Text>
                <Text style={[styles.financialValue, {color: '#f44336'}]}>
                  ${economicData.healthcareCosts}M
                </Text>
              </View>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Productivity Loss</Text>
                <Text style={[styles.financialValue, {color: '#f44336'}]}>
                  ${economicData.productivityLoss}M
                </Text>
              </View>
              <View style={styles.financialRow}>
                <Text style={styles.financialLabel}>Clean Air Benefits</Text>
                <Text style={[styles.financialValue, {color: colors.success}]}>
                  +${economicData.cleanAirBenefits}M
                </Text>
              </View>
              <View style={[styles.financialRow, styles.financialTotal]}>
                <Text style={styles.financialTotalLabel}>Net Impact</Text>
                <Text
                  style={[
                    styles.financialTotalValue,
                    {
                      color:
                        economicData.totalImpact > 0
                          ? colors.success
                          : '#f44336',
                    },
                  ]}>
                  {economicData.totalImpact > 0 ? '+' : ''}$
                  {economicData.totalImpact}M
                </Text>
              </View>
            </View>
          );

        case 'recommendations':
          return (
            <View style={styles.recommendationsContainer}>
              {widget.data.map((rec: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={[styles.bullet, {color: config.accent}]}>•</Text>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>
          );

        case 'emergency':
          return (
            <View style={styles.emergencyContainer}>
              <View
                style={[
                  styles.emergencyBadge,
                  {backgroundColor: config.accent},
                ]}>
                <Text style={styles.emergencyLevel}>
                  {widget.data.level.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.emergencyAffected}>
                {widget.data.affected}
              </Text>
            </View>
          );

        case 'participation':
          return (
            <View style={styles.participationContainer}>
              <Text style={[styles.participationValue, {color: config.accent}]}>
                {widget.data.active}
              </Text>
              <Text style={styles.participationGrowth}>
                {widget.data.growth} this month
              </Text>
            </View>
          );

        default:
          return (
            <Text style={styles.defaultText}>
              {JSON.stringify(widget.data)}
            </Text>
          );
      }
    };

    return (
      <View key={widget.id} style={getWidgetStyle()}>
        <Text style={styles.widgetTitle}>{widget.title}</Text>
        {renderWidgetContent()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Dashboard Selector Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}>
        {[
          {key: 'health', label: 'Health', icon: '🏥'},
          {key: 'policy', label: 'Policy', icon: '📊'},
          {key: 'emergency', label: 'Emergency', icon: '🚨'},
          {key: 'economic', label: 'Economic', icon: '💰'},
          {key: 'community', label: 'Community', icon: '👥'},
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && [
                styles.selectedTab,
                {borderBottomColor: config.accent},
              ],
            ]}
            onPress={() => {
              setSelectedTab(tab.key as any);
              onDashboardChange(tab.key as any);
            }}>
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                selectedTab === tab.key && [
                  styles.selectedTabLabel,
                  {color: config.accent},
                ],
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dashboard Content */}
      <Card title={config.title}>
        <View
          style={[styles.dashboardContainer, {backgroundColor: config.color}]}>
          {/* Prediction Time Picker */}
          <View style={styles.timePickerContainer}>
            <PredictionTimePicker showCard={false} compact={true} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.widgetsContainer}>
              {config.widgets.map(renderWidget)}
            </View>

            {/* Current AQI Summary */}
            <View style={styles.aqiSummary}>
              <Text style={styles.aqiSummaryTitle}>Current Air Quality</Text>
              <View style={styles.aqiSummaryContent}>
                <Text style={[styles.aqiValue, {color: config.accent}]}>
                  {airQualityData.aqi}
                </Text>
                <View style={styles.aqiDetails}>
                  <Text style={styles.aqiStatus}>{airQualityData.status}</Text>
                  <Text style={styles.aqiUpdated}>
                    Updated {airQualityData.lastUpdated}
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexGrow: 0,
    marginBottom: 15,
  },
  tabContent: {
    paddingHorizontal: 15,
  },
  tab: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  selectedTab: {
    borderBottomWidth: 2,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedTabLabel: {
    fontWeight: '600',
  },
  dashboardContainer: {
    borderRadius: 10,
    padding: 15,
    minHeight: 400,
  },
  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  widget: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  widgetSmall: {
    width: (width - 80) / 2,
  },
  widgetMedium: {
    width: width - 80,
  },
  widgetLarge: {
    width: width - 80,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  widgetSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trendIndicator: {
    fontSize: 16,
  },
  statContainer: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  gaugeContainer: {
    alignItems: 'center',
  },
  gauge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gaugeTarget: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
  },
  financialContainer: {
    paddingVertical: 5,
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  financialLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  financialValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  financialTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 10,
    paddingTop: 10,
  },
  financialTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  financialTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  recommendationsContainer: {
    paddingVertical: 5,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  emergencyContainer: {
    alignItems: 'center',
  },
  emergencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 10,
  },
  emergencyLevel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  emergencyAffected: {
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  participationContainer: {
    alignItems: 'center',
  },
  participationValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  participationGrowth: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  defaultText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  aqiSummary: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  aqiSummaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  aqiSummaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aqiValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginRight: 15,
  },
  aqiDetails: {
    flex: 1,
  },
  aqiStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  aqiUpdated: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  timePickerContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default StakeholderDashboard;
