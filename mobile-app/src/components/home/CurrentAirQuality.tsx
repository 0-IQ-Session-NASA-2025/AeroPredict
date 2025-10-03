import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, Dimensions} from 'react-native';
import {colors} from '../../styles/commonStyles';

interface CurrentAirQualityProps {
  aqi: number;
  status: string;
  lastUpdated: string;
}

const {width} = Dimensions.get('window');

const CurrentAirQuality: React.FC<CurrentAirQualityProps> = ({
  aqi,
  status,
  lastUpdated,
}) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Animate progress circle
    Animated.timing(progressAnim, {
      toValue: aqi / 200, // Max AQI for animation (0 to 1)
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Animate scale
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [aqi]);

  const getAQIData = (value: number) => {
    if (value <= 50) {
      return {
        color: '#10B981', // Green
        bgColor: '#DCFCE7',
        level: 'Good',
        emoji: '😊',
        description: 'Air quality is satisfactory',
      };
    } else if (value <= 100) {
      return {
        color: '#F59E0B', // Yellow
        bgColor: '#FEF3C7',
        level: 'Moderate',
        emoji: '😐',
        description: 'Air quality is acceptable',
      };
    } else if (value <= 150) {
      return {
        color: '#EF4444', // Red
        bgColor: '#FEE2E2',
        level: 'Unhealthy',
        emoji: '😷',
        description: 'May cause health issues',
      };
    } else {
      return {
        color: '#7C2D12', // Dark red
        bgColor: '#FEE2E2',
        level: 'Hazardous',
        emoji: '🚨',
        description: 'Health warnings',
      };
    }
  };

  const aqiData = getAQIData(aqi);

  const CircularProgress = () => {
    const size = 140;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Pulse animation
    useEffect(() => {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();

      return () => pulse.stop();
    }, [pulseAnim]);

    return (
      <View style={styles.circularProgressContainer}>
        {/* Outer glow rings */}
        <Animated.View
          style={[
            styles.glowRing,
            {
              width: size + 60,
              height: size + 60,
              borderRadius: (size + 60) / 2,
              backgroundColor: aqiData.color + '10',
              transform: [{scale: pulseAnim}],
            },
          ]}
        />

        <View
          style={[
            styles.glowRing,
            {
              width: size + 30,
              height: size + 30,
              borderRadius: (size + 30) / 2,
              backgroundColor: aqiData.color + '20',
            },
          ]}
        />

        {/* Main circle */}
        <View
          style={[
            styles.mainCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: aqiData.color,
            },
          ]}
        />

        {/* Content overlay */}
        <View style={styles.circularContent}>
          <Text style={styles.emojiIcon}>{aqiData.emoji}</Text>
          <Text style={[styles.aqiNumber, {color: '#FFFFFF'}]}>{aqi}</Text>
          <Text style={[styles.aqiLabel, {color: '#FFFFFF'}]}>AQI</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: aqiData.bgColor,
          transform: [{scale: scaleAnim}],
        },
      ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Air Quality Index</Text>
          <View style={[styles.statusBadge, {backgroundColor: aqiData.color}]}>
            <Text style={styles.statusBadgeText}>{aqiData.level}</Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <CircularProgress />

        <View style={styles.detailsContainer}>
          <Text style={[styles.statusText, {color: aqiData.color}]}>
            {status || aqiData.level}
          </Text>
          <Text style={styles.descriptionText}>{aqiData.description}</Text>

          {/* AQI Scale */}
          <View style={styles.scaleContainer}>
            <Text style={styles.scaleTitle}>AQI Scale</Text>
            <View style={styles.scaleBar}>
              <View
                style={[styles.scaleSegment, {backgroundColor: '#10B981'}]}
              />
              <View
                style={[styles.scaleSegment, {backgroundColor: '#F59E0B'}]}
              />
              <View
                style={[styles.scaleSegment, {backgroundColor: '#EF4444'}]}
              />
              <View
                style={[styles.scaleSegment, {backgroundColor: '#7C2D12'}]}
              />
            </View>
            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>0-50</Text>
              <Text style={styles.scaleLabel}>51-100</Text>
              <Text style={styles.scaleLabel}>101-150</Text>
              <Text style={styles.scaleLabel}>151+</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.updateContainer}>
          <Text style={styles.updateLabel}>Last Updated</Text>
          <Text style={styles.updateTime}>{lastUpdated}</Text>
        </View>
        <View style={styles.refreshIndicator}>
          <View style={styles.refreshDot} />
          <Text style={styles.refreshText}>Live</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 5,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    marginBottom: 24,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  circularProgressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  glowRing: {
    position: 'absolute',
  },
  mainCircle: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  circularContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  emojiIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  aqiNumber: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  aqiLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 24,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 20,
  },
  scaleContainer: {
    marginTop: 16,
  },
  scaleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  scaleBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  scaleSegment: {
    flex: 1,
    marginRight: 2,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  updateContainer: {
    flex: 1,
  },
  updateLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  updateTime: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  refreshIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  refreshDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  refreshText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});

export default CurrentAirQuality;
