import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {colors} from '../../styles/commonStyles';
import Card from '../common/Card';
import {EconomicImpact} from '../../types/airGuard';
import {usePredictionTime} from '../../contexts/PredictionTimeContext';
import PredictionTimePicker from '../common/PredictionTimePicker';

interface EconomicImpactCardProps {
  timeframe: 'daily' | 'monthly' | 'yearly';
  onTimeframeChange: (timeframe: 'daily' | 'monthly' | 'yearly') => void;
}

const {width} = Dimensions.get('window');

const EconomicImpactCard: React.FC<EconomicImpactCardProps> = ({
  timeframe,
  onTimeframeChange,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<string>('total');
  const {formatPredictionTime, getAPITimestamp} = usePredictionTime();

  const getEconomicData = (period: string): EconomicImpact => {
    const multipliers = {
      daily: 1,
      monthly: 30,
      yearly: 365,
    };

    const multiplier = multipliers[period as keyof typeof multipliers];

    return {
      healthcareCosts: +((2.4 * multiplier) / 365).toFixed(2),
      productivityLoss: +((1.8 * multiplier) / 365).toFixed(2),
      environmentalDamage: +((0.9 * multiplier) / 365).toFixed(2),
      cleanAirBenefits: +((5.2 * multiplier) / 365).toFixed(2),
      totalImpact: +((-1.1 * multiplier) / 365).toFixed(2),
    };
  };

  const economicData = getEconomicData(timeframe);

  const formatCurrency = (amount: number): string => {
    if (Math.abs(amount) >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (Math.abs(amount) >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  };

  const getImpactColor = (value: number): string => {
    return value > 0 ? colors.success : '#f44336';
  };

  const getMetricDetails = (metric: string) => {
    switch (metric) {
      case 'healthcare':
        return {
          title: 'Healthcare Costs',
          value: economicData.healthcareCosts,
          description: 'Direct medical expenses related to air pollution',
          breakdown: [
            'Emergency room visits: 40%',
            'Respiratory treatments: 35%',
            'Prescription medications: 15%',
            'Preventive care: 10%',
          ],
        };
      case 'productivity':
        return {
          title: 'Productivity Loss',
          value: economicData.productivityLoss,
          description: 'Economic impact from reduced work capacity',
          breakdown: [
            'Sick days: 45%',
            'Reduced efficiency: 30%',
            'Healthcare appointments: 15%',
            'School absences: 10%',
          ],
        };
      case 'environmental':
        return {
          title: 'Environmental Damage',
          value: economicData.environmentalDamage,
          description: 'Cost of environmental degradation and cleanup',
          breakdown: [
            'Property damage: 50%',
            'Agricultural losses: 25%',
            'Ecosystem restoration: 15%',
            'Infrastructure maintenance: 10%',
          ],
        };
      case 'benefits':
        return {
          title: 'Clean Air Benefits',
          value: economicData.cleanAirBenefits,
          description: 'Economic value of clean air initiatives',
          breakdown: [
            'Health improvements: 40%',
            'Increased property values: 25%',
            'Tourism benefits: 20%',
            'Reduced maintenance costs: 15%',
          ],
        };
      default:
        return {
          title: 'Total Economic Impact',
          value: economicData.totalImpact,
          description: 'Net economic effect of current air quality',
          breakdown: [
            'Healthcare savings potential: 35%',
            'Productivity improvements: 30%',
            'Environmental benefits: 20%',
            'Quality of life improvements: 15%',
          ],
        };
    }
  };

  const selectedDetails = getMetricDetails(selectedMetric);

  const renderROIAnalysis = () => (
    <View style={styles.roiSection}>
      <Text style={styles.sectionTitle}>Investment ROI Analysis</Text>
      <View style={styles.roiGrid}>
        <View style={styles.roiItem}>
          <Text style={styles.roiValue}>3.2x</Text>
          <Text style={styles.roiLabel}>Clean Air ROI</Text>
        </View>
        <View style={styles.roiItem}>
          <Text style={styles.roiValue}>18 mo</Text>
          <Text style={styles.roiLabel}>Payback Period</Text>
        </View>
        <View style={styles.roiItem}>
          <Text style={styles.roiValue}>$12.5M</Text>
          <Text style={styles.roiLabel}>Potential Savings</Text>
        </View>
        <View style={styles.roiItem}>
          <Text style={styles.roiValue}>85%</Text>
          <Text style={styles.roiLabel}>Health Benefits</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Card title="Economic Impact Dashboard">
      <View style={styles.container}>
        {/* Prediction Time Picker */}
        <View style={styles.timePickerContainer}>
          <PredictionTimePicker showCard={false} compact={true} />
        </View>
        {/* Timeframe Selector */}
        <View style={styles.timeframeContainer}>
          {[
            {key: 'daily', label: 'Daily'},
            {key: 'monthly', label: 'Monthly'},
            {key: 'yearly', label: 'Yearly'},
          ].map(option => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.timeframeButton,
                timeframe === option.key && styles.selectedTimeframe,
              ]}
              onPress={() => onTimeframeChange(option.key as any)}>
              <Text
                style={[
                  styles.timeframeText,
                  timeframe === option.key && styles.selectedTimeframeText,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Economic Metrics */}
        <View style={styles.metricsGrid}>
          <TouchableOpacity
            style={[
              styles.metricCard,
              selectedMetric === 'total' && styles.selectedMetricCard,
            ]}
            onPress={() => setSelectedMetric('total')}>
            <Text style={styles.metricLabel}>Net Impact</Text>
            <Text
              style={[
                styles.metricValue,
                {color: getImpactColor(economicData.totalImpact)},
              ]}>
              {economicData.totalImpact > 0 ? '+' : ''}
              {formatCurrency(economicData.totalImpact)}
            </Text>
            <Text style={styles.metricPeriod}>
              per {timeframe.replace('ly', '')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricCard,
              selectedMetric === 'healthcare' && styles.selectedMetricCard,
            ]}
            onPress={() => setSelectedMetric('healthcare')}>
            <Text style={styles.metricLabel}>Healthcare</Text>
            <Text style={[styles.metricValue, {color: '#f44336'}]}>
              -{formatCurrency(economicData.healthcareCosts)}
            </Text>
            <Text style={styles.metricPeriod}>
              per {timeframe.replace('ly', '')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricCard,
              selectedMetric === 'productivity' && styles.selectedMetricCard,
            ]}
            onPress={() => setSelectedMetric('productivity')}>
            <Text style={styles.metricLabel}>Productivity</Text>
            <Text style={[styles.metricValue, {color: '#f44336'}]}>
              -{formatCurrency(economicData.productivityLoss)}
            </Text>
            <Text style={styles.metricPeriod}>
              per {timeframe.replace('ly', '')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricCard,
              selectedMetric === 'benefits' && styles.selectedMetricCard,
            ]}
            onPress={() => setSelectedMetric('benefits')}>
            <Text style={styles.metricLabel}>Clean Air Benefits</Text>
            <Text style={[styles.metricValue, {color: colors.success}]}>
              +{formatCurrency(economicData.cleanAirBenefits)}
            </Text>
            <Text style={styles.metricPeriod}>
              per {timeframe.replace('ly', '')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Selected Metric Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>{selectedDetails.title}</Text>
          <Text style={styles.detailsDescription}>
            {selectedDetails.description}
          </Text>

          <View style={styles.breakdownContainer}>
            <Text style={styles.breakdownTitle}>Cost Breakdown:</Text>
            {selectedDetails.breakdown.map((item, index) => (
              <View key={index} style={styles.breakdownItem}>
                <Text style={styles.breakdownBullet}>•</Text>
                <Text style={styles.breakdownText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ROI Analysis */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderROIAnalysis()}
        </ScrollView>

        {/* Policy Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Policy Recommendations</Text>
          <View style={styles.recommendationsList}>
            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>💡</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>
                  Invest in Public Transportation
                </Text>
                <Text style={styles.recommendationText}>
                  Potential $2.1M annual savings through reduced vehicle
                  emissions
                </Text>
              </View>
            </View>

            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>🏭</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>
                  Industrial Emission Standards
                </Text>
                <Text style={styles.recommendationText}>
                  Stricter regulations could reduce healthcare costs by 25%
                </Text>
              </View>
            </View>

            <View style={styles.recommendationItem}>
              <Text style={styles.recommendationIcon}>🌳</Text>
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationTitle}>
                  Urban Green Spaces
                </Text>
                <Text style={styles.recommendationText}>
                  Every 10% increase in green cover reduces pollution costs by
                  $180K
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  selectedTimeframe: {
    backgroundColor: colors.primary,
  },
  timeframeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  selectedTimeframeText: {
    color: colors.white,
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metricCard: {
    width: (width - 80) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMetricCard: {
    borderColor: colors.primary,
    backgroundColor: '#f0f8ff',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  metricPeriod: {
    fontSize: 10,
    color: colors.textLight,
  },
  detailsSection: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  detailsDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  breakdownContainer: {
    marginTop: 10,
  },
  breakdownTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  breakdownBullet: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
    marginTop: 1,
  },
  breakdownText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  roiSection: {
    backgroundColor: '#f0f8f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minWidth: width - 60,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  roiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  roiItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
  },
  roiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 4,
  },
  roiLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  recommendationsSection: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendationsList: {
    marginTop: 10,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  recommendationIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  timePickerContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default EconomicImpactCard;
