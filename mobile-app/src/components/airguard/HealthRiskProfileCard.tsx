import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import {colors} from '../../styles/commonStyles';
import Card from '../common/Card';
import {UserProfile, AirQualityData} from '../../types/airGuard';
import {usePredictionTime} from '../../contexts/PredictionTimeContext';
import PredictionTimePicker from '../common/PredictionTimePicker';

interface HealthRiskProfileCardProps {
  userProfile: UserProfile;
  airQuality: AirQualityData;
  onUpdateProfile: (profile: UserProfile) => void;
}

const HealthRiskProfileCard: React.FC<HealthRiskProfileCardProps> = ({
  userProfile,
  airQuality,
  onUpdateProfile,
}) => {
  const [expanded, setExpanded] = useState(false);
  // const {formatPredictionTime, getAPITimestamp} = usePredictionTime();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return colors.success;
      case 'moderate':
        return '#ff9800';
      case 'high':
        return '#f44336';
      case 'very-high':
        return '#8b0000';
      default:
        return colors.textSecondary;
    }
  };

  const getPersonalizedRecommendations = () => {
    const recommendations = [];
    const hasRespiratoryConditions = userProfile.healthConditions.some(
      condition => ['asthma', 'copd', 'lung-disease'].includes(condition),
    );

    if (airQuality.aqi > 100 && hasRespiratoryConditions) {
      recommendations.push('Avoid outdoor activities');
      recommendations.push('Use your rescue inhaler if needed');
      recommendations.push('Stay indoors with air purifier on');
    } else if (airQuality.aqi > 50) {
      recommendations.push('Consider limiting outdoor exercise');
      recommendations.push('Wear a mask if going outside');
    } else {
      recommendations.push('Great day for outdoor activities!');
      recommendations.push('Consider opening windows for fresh air');
    }

    if (userProfile.age > 65 || userProfile.age < 12) {
      recommendations.push('Take extra precautions due to age sensitivity');
    }

    return recommendations;
  };

  const getRiskScore = () => {
    let score = airQuality.aqi;

    if (userProfile.healthConditions.length > 0) {
      score *= 1.3;
    }

    if (userProfile.age > 65 || userProfile.age < 12) {
      score *= 1.2;
    }

    if (userProfile.activityLevel === 'high' && airQuality.aqi > 100) {
      score *= 1.1;
    }

    return Math.round(score);
  };

  const personalRisk = getRiskScore();
  const riskLevel =
    personalRisk <= 50
      ? 'low'
      : personalRisk <= 100
      ? 'moderate'
      : personalRisk <= 150
      ? 'high'
      : 'very-high';

  return (
    <Card title="Personal Health Risk Profile">
      <View style={styles.container}>
        {/* Prediction Time Picker */}
        <View style={styles.timePickerContainer}>
          <PredictionTimePicker showCard={false} compact={true} />
        </View>
        {/* Risk Score Display */}
        <View style={styles.riskScoreContainer}>
          <View style={styles.riskScoreMain}>
            <Text style={[styles.riskScore, {color: getRiskColor(riskLevel)}]}>
              {personalRisk}
            </Text>
            <Text style={styles.riskLabel}>Personal Risk Score</Text>
          </View>
          <View style={styles.riskIndicator}>
            <View
              style={[
                styles.riskDot,
                {backgroundColor: getRiskColor(riskLevel)},
              ]}
            />
            <Text style={[styles.riskText, {color: getRiskColor(riskLevel)}]}>
              {riskLevel.replace('-', ' ').toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Risk Factors */}
        <TouchableOpacity
          style={styles.expandButton}
          onPress={() => setExpanded(!expanded)}>
          <Text style={styles.expandButtonText}>
            {expanded ? '▼ Hide Details' : '▶ View Risk Factors'}
          </Text>
        </TouchableOpacity>

        {expanded && (
          <ScrollView style={styles.expandedContent}>
            {/* Health Conditions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Conditions</Text>
              {userProfile.healthConditions.length > 0 ? (
                userProfile.healthConditions.map((condition, index) => (
                  <View key={index} style={styles.conditionChip}>
                    <Text style={styles.conditionText}>{condition}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noConditionsText}>None reported</Text>
              )}
            </View>

            {/* Demographics */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Demographics</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>{userProfile.age} years</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Activity Level:</Text>
                <Text style={styles.infoValue}>
                  {userProfile.activityLevel}
                </Text>
              </View>
            </View>

            {/* Personalized Recommendations */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Personalized Recommendations
              </Text>
              {getPersonalizedRecommendations().map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationBullet}>•</Text>
                  <Text style={styles.recommendationText}>
                    {recommendation}
                  </Text>
                </View>
              ))}
            </View>

            {/* Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Alert Settings</Text>
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Switch
                  value={userProfile.preferences.notifications}
                  onValueChange={value => {
                    const updatedProfile = {
                      ...userProfile,
                      preferences: {
                        ...userProfile.preferences,
                        notifications: value,
                      },
                    };
                    onUpdateProfile(updatedProfile);
                  }}
                  trackColor={{false: '#767577', true: colors.primary}}
                />
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Alert Threshold:</Text>
                <Text style={styles.infoValue}>
                  AQI &gt; {userProfile.preferences.alertThreshold}
                </Text>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  riskScoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  riskScoreMain: {
    alignItems: 'center',
  },
  riskScore: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  riskLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: -5,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  riskText: {
    fontSize: 14,
    fontWeight: '600',
  },
  expandButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  expandButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  expandedContent: {
    maxHeight: 400,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  conditionChip: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  conditionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
  },
  noConditionsText: {
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  recommendationBullet: {
    color: colors.primary,
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  timePickerContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default HealthRiskProfileCard;
