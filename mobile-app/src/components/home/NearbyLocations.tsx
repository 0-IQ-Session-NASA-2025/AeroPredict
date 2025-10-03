import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Card from '../common/Card';
import {colors} from '../../styles/commonStyles';
import {AirQualityData} from '../../types';

interface NearbyLocationsProps {
  locations: AirQualityData[];
}

const NearbyLocations: React.FC<NearbyLocationsProps> = ({locations}) => {
  const getAQIBackgroundColor = (aqi: number) => {
    if (aqi > 100) {return colors.danger;}
    if (aqi > 50) {return colors.secondary;}
    return colors.success;
  };

  return (
    <Card title="Nearby Locations">
      {locations.map((item, index) => (
        <View key={index} style={styles.locationItem}>
          <View style={styles.locationInfo}>
            <Text style={styles.locationName}>{item.location}</Text>
            <Text style={styles.locationStatus}>{item.status}</Text>
          </View>
          <View
            style={[
              styles.aqiBadge,
              {backgroundColor: getAQIBackgroundColor(item.aqi)},
            ]}>
            <Text style={styles.aqiBadgeText}>{item.aqi}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
};

const styles = StyleSheet.create({
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  locationStatus: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  aqiBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 45,
    alignItems: 'center',
  },
  aqiBadgeText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default NearbyLocations;
