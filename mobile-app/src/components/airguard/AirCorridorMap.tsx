import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {colors} from '../../styles/commonStyles';
import Card from '../common/Card';
import {LocationData, RouteData, RouteOption} from '../../types/airGuard';
import {usePredictionTime} from '../../contexts/PredictionTimeContext';
import PredictionTimePicker from '../common/PredictionTimePicker';

interface AirCorridorMapProps {
  currentLocation: LocationData;
  onRouteSelected: (route: RouteOption) => void;
}

const AirCorridorMap: React.FC<AirCorridorMapProps> = ({
  currentLocation,
  onRouteSelected,
}) => {
  const [destination, setDestination] = useState('');
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);
  // const {formatPredictionTime, getAPITimestamp} = usePredictionTime();

  const mockRoutes: RouteOption[] = [
    {
      id: '1',
      path: [
        currentLocation,
        {
          latitude: currentLocation.latitude + 0.01,
          longitude: currentLocation.longitude + 0.01,
          address: 'Via Park',
        },
        {
          latitude: currentLocation.latitude + 0.02,
          longitude: currentLocation.longitude + 0.02,
          address: 'Destination',
        },
      ],
      avgAqi: 45,
      duration: 25,
      distance: 3.2,
      exposureRisk: 'low',
    },
    {
      id: '2',
      path: [
        currentLocation,
        {
          latitude: currentLocation.latitude + 0.005,
          longitude: currentLocation.longitude + 0.015,
          address: 'Via Main St',
        },
        {
          latitude: currentLocation.latitude + 0.02,
          longitude: currentLocation.longitude + 0.02,
          address: 'Destination',
        },
      ],
      avgAqi: 78,
      duration: 18,
      distance: 2.8,
      exposureRisk: 'moderate',
    },
    {
      id: '3',
      path: [
        currentLocation,
        {
          latitude: currentLocation.latitude - 0.005,
          longitude: currentLocation.longitude + 0.025,
          address: 'Via Highway',
        },
        {
          latitude: currentLocation.latitude + 0.02,
          longitude: currentLocation.longitude + 0.02,
          address: 'Destination',
        },
      ],
      avgAqi: 112,
      duration: 12,
      distance: 2.5,
      exposureRisk: 'high',
    },
  ];

  const findRoutes = () => {
    if (!destination.trim()) {
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData: RouteData = {
        id: 'route-' + Date.now(),
        origin: currentLocation,
        destination: {
          latitude: currentLocation.latitude + 0.02,
          longitude: currentLocation.longitude + 0.02,
          address: destination,
        },
        routes: mockRoutes,
      };
      setRouteData(mockData);
      setShowRouteModal(true);
      setLoading(false);
    }, 1000);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return colors.success;
      case 'moderate':
        return '#ff9800';
      case 'high':
        return '#f44336';
      default:
        return colors.textSecondary;
    }
  };

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) {
      return colors.success;
    }
    if (aqi <= 100) {
      return '#ff9800';
    }
    return '#f44336';
  };

  const generateMapHTML = () => {
    if (!routeData || !selectedRoute) {
      return '';
    }

    const pathCoords = selectedRoute.path
      .map(p => `[${p.latitude}, ${p.longitude}]`)
      .join(', ');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <style>
            body { margin: 0; padding: 0; }
            #map { height: 100vh; width: 100vw; }
            .air-quality-legend {
              position: absolute;
              bottom: 20px;
              right: 20px;
              background: white;
              padding: 10px;
              border-radius: 5px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              z-index: 1000;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div class="air-quality-legend">
            <div><strong>Air Quality</strong></div>
            <div style="color: #4caf50;">● Good (0-50)</div>
            <div style="color: #ff9800;">● Moderate (51-100)</div>
            <div style="color: #f44336;">● Unhealthy (101+)</div>
          </div>
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <script>
            const map = L.map('map').setView([${currentLocation.latitude}, ${
      currentLocation.longitude
    }], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add origin marker
            L.marker([${currentLocation.latitude}, ${
      currentLocation.longitude
    }])
              .addTo(map)
              .bindPopup('<b>Origin</b><br>${currentLocation.address}');

            // Add destination marker
            L.marker([${routeData.destination.latitude}, ${
      routeData.destination.longitude
    }])
              .addTo(map)
              .bindPopup('<b>Destination</b><br>${
                routeData.destination.address
              }');

            // Add route path
            const routePath = [${pathCoords}];
            const polyline = L.polyline(routePath, {
              color: '${getRiskColor(selectedRoute.exposureRisk)}',
              weight: 6,
              opacity: 0.8
            }).addTo(map);

            // Add air quality heat zones (mock data)
            const airQualityZones = [
              { lat: ${currentLocation.latitude + 0.005}, lng: ${
      currentLocation.longitude + 0.005
    }, aqi: 65, radius: 500 },
              { lat: ${currentLocation.latitude + 0.01}, lng: ${
      currentLocation.longitude + 0.01
    }, aqi: 45, radius: 400 },
              { lat: ${currentLocation.latitude + 0.015}, lng: ${
      currentLocation.longitude + 0.015
    }, aqi: 95, radius: 600 },
            ];

            airQualityZones.forEach(zone => {
              const color = zone.aqi <= 50 ? '#4caf50' : zone.aqi <= 100 ? '#ff9800' : '#f44336';
              L.circle([zone.lat, zone.lng], {
                color: color,
                fillColor: color,
                fillOpacity: 0.2,
                radius: zone.radius
              }).addTo(map).bindPopup(\`AQI: \${zone.aqi}\`);
            });

            // Fit map to show full route
            map.fitBounds(polyline.getBounds(), { padding: [20, 20] });
          </script>
        </body>
      </html>
    `;
  };

  return (
    <Card title="Best Route finder">
      <View style={styles.container}>
        {/* Prediction Time Picker */}
        <View style={styles.timePickerContainer}>
          <PredictionTimePicker showCard={false} compact={true} />
        </View>
        {/* Destination Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.destinationInput}
            placeholder="Enter destination..."
            value={destination}
            onChangeText={setDestination}
          />
          <TouchableOpacity
            style={[
              styles.searchButton,
              loading && styles.searchButtonDisabled,
            ]}
            onPress={findRoutes}
            disabled={loading || !destination.trim()}>
            <Text style={styles.searchButtonText}>
              {loading ? 'Finding...' : 'Find Routes'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map Display */}
        {routeData && selectedRoute && (
          <View style={styles.mapContainer}>
            <WebView
              style={styles.map}
              source={{html: generateMapHTML()}}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
        )}

        {/* Current Air Quality Strip */}
        <View style={styles.currentAqiStrip}>
          <Text style={styles.stripLabel}>Current Location AQI</Text>
          <Text style={[styles.stripValue, {color: getAQIColor(68)}]}>68</Text>
          <Text style={styles.stripStatus}>Moderate</Text>
        </View>

        {/* Route Modal */}
        <Modal
          visible={showRouteModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowRouteModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Route Options</Text>
                <TouchableOpacity
                  onPress={() => setShowRouteModal(false)}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.routesList}>
                {mockRoutes.map((route, index) => (
                  <TouchableOpacity
                    key={route.id}
                    style={[
                      styles.routeOption,
                      selectedRoute?.id === route.id && styles.selectedRoute,
                    ]}
                    onPress={() => {
                      setSelectedRoute(route);
                      onRouteSelected(route);
                    }}>
                    <View style={styles.routeHeader}>
                      <Text style={styles.routeName}>Route {index + 1}</Text>
                      <View
                        style={[
                          styles.riskBadge,
                          {backgroundColor: getRiskColor(route.exposureRisk)},
                        ]}>
                        <Text style={styles.riskBadgeText}>
                          {route.exposureRisk}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.routeMetrics}>
                      <View style={styles.metric}>
                        <Text style={styles.metricValue}>{route.avgAqi}</Text>
                        <Text style={styles.metricLabel}>Avg AQI</Text>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricValue}>
                          {route.duration}m
                        </Text>
                        <Text style={styles.metricLabel}>Duration</Text>
                      </View>
                      <View style={styles.metric}>
                        <Text style={styles.metricValue}>
                          {route.distance}km
                        </Text>
                        <Text style={styles.metricLabel}>Distance</Text>
                      </View>
                    </View>

                    <View style={styles.routeRecommendation}>
                      {route.exposureRisk === 'low' && (
                        <Text style={styles.recommendationText}>
                          ✓ Recommended for sensitive individuals
                        </Text>
                      )}
                      {route.exposureRisk === 'moderate' && (
                        <Text style={styles.recommendationText}>
                          ⚠ Moderate exposure - consider alternatives
                        </Text>
                      )}
                      {route.exposureRisk === 'high' && (
                        <Text style={styles.recommendationText}>
                          ⚠ High exposure - not recommended for sensitive groups
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  !selectedRoute && styles.selectButtonDisabled,
                ]}
                onPress={() => {
                  if (selectedRoute) {
                    setShowRouteModal(false);
                  }
                }}
                disabled={!selectedRoute}>
                <Text style={styles.selectButtonText}>
                  {selectedRoute ? 'View Route on Map' : 'Select a Route'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  destinationInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.secondary,
  },
  searchButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  map: {
    flex: 1,
  },
  currentAqiStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  stripLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  stripValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stripStatus: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  routesList: {
    padding: 20,
  },
  routeOption: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    backgroundColor: colors.white,
  },
  selectedRoute: {
    borderColor: colors.primary,
    backgroundColor: '#f0f8ff',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  routeMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  routeRecommendation: {
    marginTop: 10,
  },
  recommendationText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  selectButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  selectButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  timePickerContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default AirCorridorMap;
