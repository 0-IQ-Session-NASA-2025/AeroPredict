import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors} from '../../styles/commonStyles';
import {usePredictionTime} from '../../contexts/PredictionTimeContext';
import Card from './Card';

const {width} = Dimensions.get('window');

interface PredictionTimePickerProps {
  showCard?: boolean;
  compact?: boolean;
}

const PredictionTimePicker: React.FC<PredictionTimePickerProps> = ({
  showCard = true,
  compact = false,
}) => {
  const {
    predictionTime,
    setPredictionTime,
    isCurrentTime,
    timeOffset,
    resetToCurrentTime,
    formatPredictionTime,
  } = usePredictionTime();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(predictionTime);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for current time
    if (isCurrentTime) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isCurrentTime]);

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);

  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 1);

  const showPicker = (pickerMode: 'date' | 'time') => {
    setTempDate(predictionTime); // Initialize temp date with current selection

    if (pickerMode === 'date') {
      setShowTimePicker(false);
      setShowDatePicker(true);
    } else {
      setShowTimePicker(true);
      setShowDatePicker(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && selectedDate) {
        setPredictionTime(selectedDate);
      }
    } else {
      // iOS - update temp date
      if (selectedDate) {
        setTempDate(selectedDate);
      }
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (event.type === 'set' && selectedTime) {
        setPredictionTime(selectedTime);
      }
    } else {
      // iOS - update temp date
      if (selectedTime) {
        setTempDate(selectedTime);
      }
    }
  };

  const confirmDateSelection = () => {
    setPredictionTime(tempDate);
    setShowDatePicker(false);
  };

  const confirmTimeSelection = () => {
    setPredictionTime(tempDate);
    setShowTimePicker(false);
  };

  const cancelSelection = () => {
    setShowDatePicker(false);
    setShowTimePicker(false);
    setTempDate(predictionTime); // Reset to original
  };

  const getQuickTimeOptions = () => [
    {label: 'Now', offset: 0},
    {label: '1h', offset: 1},
    {label: '3h', offset: 3},
    {label: '6h', offset: 6},
    {label: '12h', offset: 12},
    {label: '1d', offset: 24},
    {label: '3d', offset: 72},
  ];

  const setQuickTime = (offsetHours: number) => {
    const newTime = new Date();
    newTime.setHours(newTime.getHours() + offsetHours);
    setPredictionTime(newTime);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusData = () => {
    if (isCurrentTime) {
      return {
        color: colors.primary,
        bgColor: colors.primaryLight + '20',
        icon: '🕐',
        label: 'Current Time',
        gradient: [colors.primary, colors.primaryLight],
      };
    }
    if (timeOffset > 0) {
      return {
        color: colors.success,
        bgColor: colors.successLight + '20',
        icon: '🔮',
        label: 'Future Prediction',
        gradient: [colors.success, colors.successLight],
      };
    }
    return {
      color: colors.warning,
      bgColor: colors.warningLight + '20',
      icon: '📚',
      label: 'Historical Data',
      gradient: [colors.warning, colors.warningLight],
    };
  };

  const renderCompactView = () => {
    const statusData = getStatusData();
    return (
      <Animated.View
        style={[
          styles.compactContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Animated.View
          style={[
            styles.compactButton,
            {
              borderColor: statusData.color,
              backgroundColor: statusData.bgColor,
              transform: [{scale: pulseAnim}],
            },
          ]}>
          <TouchableOpacity
            style={styles.compactButtonInner}
            onPress={() => showPicker('date')}>
            <View
              style={[
                styles.iconContainer,
                {backgroundColor: statusData.color},
              ]}>
              <Text style={styles.compactIcon}>{statusData.icon}</Text>
            </View>
            <View style={styles.compactTextContainer}>
              <Text style={[styles.compactLabel, {color: statusData.color}]}>
                {statusData.label}
              </Text>
              <Text style={[styles.compactText, {color: statusData.color}]}>
                {formatPredictionTime()}
              </Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderFullView = () => {
    const statusData = getStatusData();
    return (
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        {/* Current Selection Display */}
        <Animated.View
          style={[
            styles.selectionDisplay,
            {
              backgroundColor: statusData.bgColor,
              borderColor: statusData.color,
              transform: [{scale: pulseAnim}],
            },
          ]}>
          <View style={styles.selectionHeader}>
            <View
              style={[
                styles.statusIconContainer,
                {backgroundColor: statusData.color},
              ]}>
              <Text style={styles.selectionIcon}>{statusData.icon}</Text>
            </View>
            <View style={styles.selectionInfo}>
              <Text style={styles.selectionTitle}>Air Quality Prediction</Text>
              <Text
                style={[styles.selectionSubtitle, {color: statusData.color}]}>
                {statusData.label}
              </Text>
            </View>
            {!isCurrentTime && (
              <TouchableOpacity
                style={[
                  styles.resetButton,
                  {backgroundColor: statusData.color},
                ]}
                onPress={resetToCurrentTime}>
                <Text style={styles.resetButtonText}>↻ Reset</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.timeDisplayContainer}>
            <Text style={[styles.selectedDateTime, {color: statusData.color}]}>
              {formatDateTime(predictionTime)}
            </Text>
            <Text style={styles.relativeTime}>{formatPredictionTime()}</Text>
          </View>
        </Animated.View>

        {/* Quick Time Selection */}
        <View style={styles.quickTimeContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Quick Selection</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.quickTimeButtons}>
            {getQuickTimeOptions().map(option => (
              <TouchableOpacity
                key={option.label}
                style={[
                  styles.quickTimeButton,
                  timeOffset === option.offset && [
                    styles.selectedQuickTime,
                    {
                      backgroundColor: statusData.color,
                      borderColor: statusData.color,
                    },
                  ],
                ]}
                onPress={() => setQuickTime(option.offset)}>
                <Text
                  style={[
                    styles.quickTimeText,
                    timeOffset === option.offset &&
                      styles.selectedQuickTimeText,
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Date/Time Selection */}
        <View style={styles.customTimeContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Custom Selection</Text>
            <View style={styles.sectionDivider} />
          </View>
          <View style={styles.customTimeButtons}>
            <TouchableOpacity
              style={[styles.dateTimeButton, {borderColor: statusData.color}]}
              onPress={() => showPicker('date')}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>📅</Text>
                <Text
                  style={[
                    styles.dateTimeButtonText,
                    {color: statusData.color},
                  ]}>
                  Select Date
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateTimeButton, {borderColor: statusData.color}]}
              onPress={() => showPicker('time')}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>⏰</Text>
                <Text
                  style={[
                    styles.dateTimeButtonText,
                    {color: statusData.color},
                  ]}>
                  Select Time
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Information */}
        <View
          style={[
            styles.infoContainer,
            {backgroundColor: statusData.color + '10'},
          ]}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>ℹ️ Information</Text>
          </View>
          <Text style={styles.infoText}>
            📈 Predictions available up to 7 days ahead
          </Text>
          <Text style={styles.infoText}>
            📊 Historical data available for past 24 hours
          </Text>
          <Text style={styles.infoText}>
            🌟 All features will show data for selected time
          </Text>
        </View>
      </Animated.View>
    );
  };

  const content = compact ? renderCompactView() : renderFullView();

  return (
    <>
      {showCard ? (
        <Card title={compact ? undefined : 'Set Air Quality Prediction Time'}>
          {content}
        </Card>
      ) : (
        content
      )}

      {/* Date Picker Modal */}
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showDatePicker}
          onRequestClose={cancelSelection}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={minDate}
                maximumDate={maxDate}
                style={styles.picker}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtons}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={cancelSelection}>
                    <Text style={styles.pickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={confirmDateSelection}>
                    <Text
                      style={[
                        styles.pickerButtonText,
                        styles.confirmButtonText,
                      ]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}

      {/* Time Picker Modal */}
      {showTimePicker && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={showTimePicker}
          onRequestClose={cancelSelection}>
          <View style={styles.modalContainer}>
            <View style={styles.pickerContainer}>
              <Text style={styles.modalTitle}>Select Time</Text>
              <DateTimePicker
                value={tempDate}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onTimeChange}
                style={styles.picker}
              />
              {Platform.OS === 'ios' && (
                <View style={styles.pickerButtons}>
                  <TouchableOpacity
                    style={styles.pickerButton}
                    onPress={cancelSelection}>
                    <Text style={styles.pickerButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.pickerButton, styles.confirmButton]}
                    onPress={confirmTimeSelection}>
                    <Text
                      style={[
                        styles.pickerButtonText,
                        styles.confirmButtonText,
                      ]}>
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  compactContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  compactButton: {
    borderRadius: 24,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  compactButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  compactIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  compactTextContainer: {
    flex: 1,
  },
  compactLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
  compactText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  selectionDisplay: {
    borderWidth: 2,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 8,
    alignItems: 'stretch',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  selectionIcon: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  selectionInfo: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  selectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  resetButtonText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  timeDisplayContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectedDateTime: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  relativeTime: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  quickTimeContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 12,
  },
  sectionDivider: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    borderRadius: 1,
  },
  quickTimeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickTimeButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: colors.surfaceLight,
    marginBottom: 12,
    minWidth: '13%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedQuickTime: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  quickTimeText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  selectedQuickTimeText: {
    color: colors.white,
    fontWeight: '700',
  },
  customTimeContainer: {
    marginBottom: 24,
  },
  customTimeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateTimeButton: {
    flex: 1,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 16,
    marginHorizontal: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  dateTimeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoHeader: {
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    margin: 20,
    minWidth: 300,
    maxWidth: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 200,
  },
  pickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  pickerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  pickerButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  confirmButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default PredictionTimePicker;
