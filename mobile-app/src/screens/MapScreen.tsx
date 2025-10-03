import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Linking,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Geolocation from '@react-native-community/geolocation';
import {commonStyles, colors} from '../styles/commonStyles';
import Card from '../components/common/Card';
import {usePredictionTime} from '../contexts/PredictionTimeContext';
import PredictionTimePicker from '../components/common/PredictionTimePicker';

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

interface AirQualityData {
  aqi: number;
  pm25: number;
  pm10: number;
  o3: number;
  no2: number;
  so2: number;
  co: number;
  status: string;
  lastUpdated: string;
}

const {height: screenHeight} = Dimensions.get('window');

const MapScreen: React.FC = () => {
  const [location, setLocation] = useState<LocationData | null>();
  const [loading, setLoading] = useState(false);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [customLocation, setCustomLocation] = useState<LocationData | null>(
    null,
  );
  const [showCustomPrediction, setShowCustomPrediction] = useState(false);
  // const {formatPredictionTime, getAPITimestamp} = usePredictionTime();

  // Bottom sheet animation values
  const bottomSheetHeight = useRef(new Animated.Value(200)).current; // Start at 200px visible
  const currentHeight = useRef(200); // Track current height manually
  const SHEET_MIN_HEIGHT = 200;
  const SHEET_MAX_HEIGHT = screenHeight * 0.7; // 70% of screen height
  const [airQuality] = useState<AirQualityData>({
    aqi: 78,
    pm25: 35.2,
    pm10: 42.1,
    o3: 68.5,
    no2: 28.3,
    so2: 12.7,
    co: 1.2,
    status: 'Moderate',
    lastUpdated: '2 minutes ago',
  });

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'AeroPredict needs access to your location to show air quality data in your area.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasLocationPermission(true);
          // getCurrentLocation();
        } else {
          showLocationPermissionAlert();
        }
      } catch (err) {
        console.warn(err);
        setLoading(false);
      }
    } else {
      // iOS permission handling
      // Geolocation.requestAuthorization();
      // .then(result => {
      //   if (result === 'granted') {
      //     setHasLocationPermission(true);
      //     getCurrentLocation();
      //   } else {
      //     showLocationPermissionAlert();
      //   }
      // })
      // .catch(err => {
      //   console.warn('Location authorization error:', err);
      //   showLocationPermissionAlert();
      // });
    }
  };

  useEffect(() => {
    checkLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showLocationPermissionAlert = () => {
    Alert.alert(
      'Location Access Required',
      'Please enable location services to view air quality data for your area. You can enable this in your device settings.',
      [
        {text: 'Cancel', onPress: () => setLoading(false)},
        {text: 'Open Settings', onPress: () => Linking.openSettings()},
        {text: 'Try Again', onPress: () => checkLocationPermission()},
      ],
    );
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    console.log('------>>>> get current location');
    Geolocation.getCurrentPosition(
      async position => {
        console.log('------>>>> position: ', JSON.stringify(position));
        const {latitude, longitude} = position.coords;

        // Get address from coordinates using OpenStreetMap Nominatim API
        const address = await getAddressFromCoordinates(latitude, longitude);

        setLocation({
          latitude,
          longitude,
          address,
        });
        setLoading(false);
      },
      error => {
        console.log('Location error:', error);
        Alert.alert(
          'Location Error',
          'Unable to get your current location. Please make sure location services are enabled.',
          [{text: 'OK', onPress: () => setLoading(false)}],
        );
      },
      {
        enableHighAccuracy: false, // Try network location first
        timeout: 30000, // Increase timeout to 30 seconds
        maximumAge: 60000, // Accept cached location up to 1 minute old
      },
    );
  };

  const getAddressFromCoordinates = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    try {
      // Using OpenStreetMap Nominatim API for reverse geocoding (free!)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await response.json();

      if (data && data.display_name) {
        return data.display_name;
      }
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } catch (error) {
      console.log('Geocoding error:', error);
      return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
  };

  const handleMapClick = async (latitude: number, longitude: number) => {
    setLoading(true);
    try {
      const address = await getAddressFromCoordinates(latitude, longitude);
      setCustomLocation({
        latitude,
        longitude,
        address,
      });
      setShowCustomPrediction(true);
      setLoading(false);
    } catch (error) {
      console.log('Error handling map click:', error);
      setLoading(false);
    }
  };

  const resetToCurrentLocation = () => {
    setCustomLocation(null);
    setShowCustomPrediction(false);
  };

  // Pan responder for bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
      onPanResponderGrant: () => {
        // Store the current height when gesture starts
        bottomSheetHeight.setOffset(currentHeight.current);
        bottomSheetHeight.setValue(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newHeight = currentHeight.current - gestureState.dy;
        if (newHeight >= SHEET_MIN_HEIGHT && newHeight <= SHEET_MAX_HEIGHT) {
          bottomSheetHeight.setValue(-gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        bottomSheetHeight.flattenOffset();
        const gestureEndHeight = currentHeight.current - gestureState.dy;
        const velocity = -gestureState.vy;

        let finalHeight;
        if (velocity > 0.5) {
          // Swipe up fast - go to max height
          finalHeight = SHEET_MAX_HEIGHT;
        } else if (velocity < -0.5) {
          // Swipe down fast - go to min height
          finalHeight = SHEET_MIN_HEIGHT;
        } else {
          // Slow swipe - snap to nearest position
          const middle = (SHEET_MIN_HEIGHT + SHEET_MAX_HEIGHT) / 2;
          finalHeight =
            gestureEndHeight > middle ? SHEET_MAX_HEIGHT : SHEET_MIN_HEIGHT;
        }

        // Update tracked height
        currentHeight.current = finalHeight;

        Animated.spring(bottomSheetHeight, {
          toValue: finalHeight,
          useNativeDriver: false,
          tension: 100,
          friction: 8,
        }).start();
      },
    }),
  ).current;

  // const getAddressFromCoordinates = async (
  //   lat: number,
  //   lng: number,
  // ): Promise<string> => {
  //   try {
  //     // Using OpenStreetMap Nominatim API for reverse geocoding (free!)
  //     const response = await fetch(
  //       `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
  //     );
  //     let data;
  //     if (data) {data = await response.json();}

  //     if (data && data.display_name) {
  //       return data.display_name;
  //     }
  //     return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  //   } catch (error) {
  //     console.log('Geocoding error:', error);
  //     return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  //   }
  // };

  const getAQIColor = (aqi: number): string => {
    if (aqi <= 50) {
      return colors.success;
    }
    if (aqi <= 100) {
      return colors.secondary;
    }
    if (aqi <= 150) {
      return '#ff9800';
    }
    if (aqi <= 200) {
      return '#f44336';
    }
    if (aqi <= 300) {
      return '#9c27b0';
    }
    return '#8b0000';
  };

  const getHealthRecommendations = (aqi: number): string[] => {
    if (aqi <= 50) {
      return [
        'Air quality is good - enjoy outdoor activities!',
        'No health precautions needed',
        'Great day for exercise and outdoor sports',
      ];
    } else if (aqi <= 100) {
      return [
        'Air quality is moderate',
        'Sensitive individuals should consider limiting outdoor exertion',
        'Generally acceptable for most people',
      ];
    } else if (aqi <= 150) {
      return [
        'Unhealthy for sensitive groups',
        'People with heart/lung disease should reduce outdoor exertion',
        'Consider wearing a mask if you must go outside',
      ];
    } else {
      return [
        'Air quality is unhealthy',
        'Everyone should limit outdoor activities',
        'Wear a mask when going outside',
        'Keep windows closed and use air purifiers',
      ];
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!hasLocationPermission) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Location Access Required</Text>
          <Text style={styles.permissionText}>
            Please enable location services to view air quality data for your
            area.
          </Text>
          <TouchableOpacity
            style={styles.enableButton}
            onPress={checkLocationPermission}>
            <Text style={styles.enableButtonText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Air Quality Map</Text>
        </View>

        {/* Prediction Time Picker */}
        <View style={styles.timePickerContainer}>
          <PredictionTimePicker showCard={false} compact={true} />
        </View>

        {/* Full Screen Map */}
        <View style={styles.mapFullContainer}>
          {location && (
            <WebView
              style={styles.map}
              source={{
                html: `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                      <style>
                        body { margin: 0; padding: 0; }
                        #map { height: 100vh; width: 100vw; cursor: crosshair; }
                        .map-instruction {
                          position: absolute;
                          top: 10px;
                          left: 10px;
                          background: rgba(0,0,0,0.8);
                          color: white;
                          padding: 8px 12px;
                          border-radius: 6px;
                          font-size: 12px;
                          z-index: 1000;
                          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="map-instruction">🎯 Tap anywhere to predict air quality</div>
                      <div id="map"></div>
                      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                      <script>
                        const map = L.map('map').setView([${
                          location.latitude
                        }, ${location.longitude}], 15);

                        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                          attribution: '© OpenStreetMap contributors'
                        }).addTo(map);

                        // Current location marker (blue)
                        const currentLocationIcon = L.divIcon({
                          html: '<div style="background-color: #2196F3; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                          className: 'current-location-marker',
                          iconSize: [20, 20],
                          iconAnchor: [10, 10]
                        });

                        const currentMarker = L.marker([${location.latitude}, ${
                  location.longitude
                }], { icon: currentLocationIcon })
                          .addTo(map)
                          .bindPopup('<b>📍 Your Current Location</b><br>AQI: ${
                            airQuality.aqi
                          } - ${airQuality.status}');

                        // Custom location marker (red) - initially hidden
                        let customMarker = null;

                        // Handle map clicks
                        map.on('click', function(e) {
                          const lat = e.latlng.lat;
                          const lng = e.latlng.lng;

                          // Remove previous custom marker
                          if (customMarker) {
                            map.removeLayer(customMarker);
                          }

                          // Create custom location icon (red)
                          const customLocationIcon = L.divIcon({
                            html: '<div style="background-color: #f44336; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                            className: 'custom-location-marker',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                          });

                          // Add new custom marker
                          customMarker = L.marker([lat, lng], { icon: customLocationIcon })
                            .addTo(map)
                            .bindPopup('<b>🎯 Selected Location</b><br>Getting air quality data...')
                            .openPopup();

                          // Send coordinates to React Native
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'mapClick',
                            latitude: lat,
                            longitude: lng
                          }));
                        });

                        ${
                          customLocation
                            ? `
                          // Add custom location marker if exists
                          if (customMarker) {
                            map.removeLayer(customMarker);
                          }
                          const customIcon = L.divIcon({
                            html: '<div style="background-color: #f44336; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                            className: 'custom-location-marker',
                            iconSize: [20, 20],
                            iconAnchor: [10, 10]
                          });
                          customMarker = L.marker([${customLocation.latitude}, ${customLocation.longitude}], { icon: customIcon })
                            .addTo(map)
                            .bindPopup('<b>🎯 Selected Location</b><br>${customLocation.address}<br>AQI: 65 - Moderate')
                            .openPopup();
                        `
                            : ''
                        }
                      </script>
                    </body>
                  </html>
                `,
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              onMessage={event => {
                const data = JSON.parse(event.nativeEvent.data);
                if (data.type === 'mapClick') {
                  handleMapClick(data.latitude, data.longitude);
                }
              }}
            />
          )}
        </View>

        {/* Sliding Bottom Sheet */}
        <Animated.View
          style={[styles.bottomSheet, {height: bottomSheetHeight}]}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} {...panResponder.panHandlers}>
            <View style={styles.dragIndicator} />
          </View>

          {/* Location Controls */}
          <View style={styles.locationControls}>
            {customLocation ? (
              // Two buttons when custom location exists
              <>
                <TouchableOpacity
                  style={[styles.locationButton, styles.currentLocationButton]}
                  onPress={getCurrentLocation}>
                  <Text style={styles.locationButtonText}>
                    📍 Current Location
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.locationButton, styles.clearLocationButton]}
                  onPress={resetToCurrentLocation}>
                  <Text style={styles.locationButtonText}>
                    ❌ Clear Selection
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              // Single centered button when no custom location
              <TouchableOpacity
                style={[styles.locationButton, styles.centeredLocationButton]}
                onPress={getCurrentLocation}>
                <Text style={styles.locationButtonText}>
                  📍 Current Location
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}>
            {/* Current Location Details */}
            {location && (
              <Card title="📍 Current Location">
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>
                    <Text style={styles.label}>Address: </Text>
                    {location.address}
                  </Text>
                  <Text style={styles.locationText}>
                    <Text style={styles.label}>Latitude: </Text>
                    {location.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.locationText}>
                    <Text style={styles.label}>Longitude: </Text>
                    {location.longitude.toFixed(6)}
                  </Text>
                </View>
              </Card>
            )}

            {/* Custom Location Details */}
            {customLocation && (
              <Card title="🎯 Selected Location for Prediction">
                <View style={styles.customLocationInfo}>
                  <Text style={styles.customLocationText}>
                    <Text style={styles.label}>Address: </Text>
                    {customLocation.address}
                  </Text>
                  <Text style={styles.customLocationText}>
                    <Text style={styles.label}>Latitude: </Text>
                    {customLocation.latitude.toFixed(6)}
                  </Text>
                  <Text style={styles.customLocationText}>
                    <Text style={styles.label}>Longitude: </Text>
                    {customLocation.longitude.toFixed(6)}
                  </Text>
                  <View style={styles.predictionNote}>
                    <Text style={styles.noteText}>
                      💡 Air quality data below shows prediction for this
                      location
                    </Text>
                  </View>
                </View>
              </Card>
            )}

            {/* Air Quality Index */}
            <Card title="Air Quality Index (AQI)">
              <View style={styles.aqiContainer}>
                <View style={styles.aqiMainValue}>
                  <Text
                    style={[
                      styles.aqiNumber,
                      {color: getAQIColor(airQuality.aqi)},
                    ]}>
                    {airQuality.aqi}
                  </Text>
                  <Text
                    style={[
                      styles.aqiStatus,
                      {color: getAQIColor(airQuality.aqi)},
                    ]}>
                    {airQuality.status}
                  </Text>
                </View>
                <Text style={styles.lastUpdated}>
                  Last updated: {airQuality.lastUpdated}
                </Text>
              </View>
            </Card>

            {/* Air Quality Parameters */}
            <Card title="Air Quality Parameters">
              <View style={styles.parametersGrid}>
                <View style={styles.parameterItem}>
                  <Text style={styles.parameterLabel}>PM2.5</Text>
                  <Text style={styles.parameterValue}>
                    {airQuality.pm25} μg/m³
                  </Text>
                </View>
                <View style={styles.parameterItem}>
                  <Text style={styles.parameterLabel}>PM10</Text>
                  <Text style={styles.parameterValue}>
                    {airQuality.pm10} μg/m³
                  </Text>
                </View>
                <View style={styles.parameterItem}>
                  <Text style={styles.parameterLabel}>O₃</Text>
                  <Text style={styles.parameterValue}>
                    {airQuality.o3} μg/m³
                  </Text>
                </View>
                <View style={styles.parameterItem}>
                  <Text style={styles.parameterLabel}>NO₂</Text>
                  <Text style={styles.parameterValue}>
                    {airQuality.no2} μg/m³
                  </Text>
                </View>
                <View style={styles.parameterItem}>
                  <Text style={styles.parameterLabel}>SO₂</Text>
                  <Text style={styles.parameterValue}>
                    {airQuality.so2} μg/m³
                  </Text>
                </View>
                <View style={styles.parameterItem}>
                  <Text style={styles.parameterLabel}>CO</Text>
                  <Text style={styles.parameterValue}>
                    {airQuality.co} mg/m³
                  </Text>
                </View>
              </View>
            </Card>

            {/* Health Recommendations */}
            <Card title="Health Precautions">
              <View style={styles.recommendationsContainer}>
                {getHealthRecommendations(airQuality.aqi).map(
                  (recommendation, index) => (
                    <View key={index} style={styles.recommendationItem}>
                      <Text style={styles.recommendationBullet}>•</Text>
                      <Text style={styles.recommendationText}>
                        {recommendation}
                      </Text>
                    </View>
                  ),
                )}
              </View>
            </Card>

            {/* Map Attribution for OpenStreetMap */}
            <Card title="Map Data">
              <Text style={styles.attribution}>
                Map data © OpenStreetMap contributors
              </Text>
            </Card>
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  enableButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  enableButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: colors.primary,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
  },
  mapContainer: {
    height: 350,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    paddingVertical: 5,
  },
  locationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  label: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
  aqiContainer: {
    alignItems: 'center',
  },
  aqiMainValue: {
    alignItems: 'center',
    marginBottom: 10,
  },
  aqiNumber: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  aqiStatus: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: -5,
  },
  lastUpdated: {
    fontSize: 12,
    color: colors.textLight,
  },
  parametersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  parameterItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  parameterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  parameterValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  recommendationsContainer: {
    paddingVertical: 5,
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 10,
  },
  recommendationBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 10,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  attribution: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timePickerContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  locationControls: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    minHeight: 50,
    alignItems: 'center',
  },
  locationButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  centeredLocationButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  currentLocationButton: {
    flex: 1,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  clearLocationButton: {
    flex: 1,
    backgroundColor: '#ff5722',
    marginLeft: 8,
  },
  locationButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  customLocationInfo: {
    paddingVertical: 5,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    marginTop: 5,
    padding: 10,
  },
  customLocationText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  predictionNote: {
    backgroundColor: '#e8f5e8',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  noteText: {
    fontSize: 12,
    color: colors.success,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  mapFullContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dragHandle: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 50,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
});

export default MapScreen;
