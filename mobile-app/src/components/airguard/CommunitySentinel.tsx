import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {colors} from '../../styles/commonStyles';
import Card from '../common/Card';
import {CommunityReport, LocationData} from '../../types/airGuard';
import {usePredictionTime} from '../../contexts/PredictionTimeContext';
import PredictionTimePicker from '../common/PredictionTimePicker';

interface CommunitySentinelProps {
  currentLocation: LocationData;
  onReportSubmit: (report: CommunityReport) => void;
}

const CommunitySentinel: React.FC<CommunitySentinelProps> = ({
  currentLocation,
  onReportSubmit,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<
    'air-quality' | 'pollution-source' | 'weather'
  >('air-quality');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  // const {formatPredictionTime, getAPITimestamp} = usePredictionTime();

  const mockReports: CommunityReport[] = [
    {
      id: '1',
      location: {
        latitude: currentLocation.latitude + 0.001,
        longitude: currentLocation.longitude + 0.001,
        address: '123 Main St',
      },
      reportedBy: 'John D.',
      type: 'air-quality',
      description: 'Strong chemical smell near industrial area',
      severity: 4,
      timestamp: '5 minutes ago',
      verified: true,
    },
    {
      id: '2',
      location: {
        latitude: currentLocation.latitude - 0.002,
        longitude: currentLocation.longitude + 0.003,
        address: 'Central Park',
      },
      reportedBy: 'Sarah M.',
      type: 'pollution-source',
      description: 'Heavy smoke from construction site',
      severity: 3,
      timestamp: '12 minutes ago',
      verified: false,
    },
    {
      id: '3',
      location: {
        latitude: currentLocation.latitude + 0.003,
        longitude: currentLocation.longitude - 0.001,
        address: 'Downtown Plaza',
      },
      reportedBy: 'Mike R.',
      type: 'air-quality',
      description: 'Unusually clear air after rain',
      severity: 1,
      timestamp: '1 hour ago',
      verified: true,
    },
  ];

  const [reports, setReports] = useState<CommunityReport[]>(mockReports);

  const submitReport = () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide a description for your report.');
      return;
    }

    setSubmitting(true);

    const newReport: CommunityReport = {
      id: Date.now().toString(),
      location: currentLocation,
      reportedBy: 'You',
      type: reportType,
      description: description.trim(),
      severity,
      timestamp: 'Just now',
      verified: false,
    };

    setTimeout(() => {
      setReports([newReport, ...reports]);
      onReportSubmit(newReport);
      setDescription('');
      setSeverity(3);
      setSubmitting(false);
      setShowReportModal(false);
      Alert.alert(
        'Success',
        'Your report has been submitted and will be reviewed by our community.',
      );
    }, 1000);
  };

  const getSeverityColor = (severity: number) => {
    if (severity <= 2) {
      return colors.success;
    }
    if (severity <= 3) {
      return '#ff9800';
    }
    return '#f44336';
  };

  const getSeverityLabel = (severity: number) => {
    if (severity <= 2) {
      return 'Low';
    }
    if (severity <= 3) {
      return 'Moderate';
    }
    return 'High';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'air-quality':
        return '💨';
      case 'pollution-source':
        return '🏭';
      case 'weather':
        return '🌤️';
      default:
        return '📍';
    }
  };

  const renderReportItem = ({item}: {item: CommunityReport}) => (
    <View style={styles.reportItem}>
      <View style={styles.reportHeader}>
        <View style={styles.reportTypeContainer}>
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
          <Text style={styles.reportType}>{item.type.replace('-', ' ')}</Text>
        </View>
        <View style={styles.verificationContainer}>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
          <View
            style={[
              styles.severityBadge,
              {backgroundColor: getSeverityColor(item.severity)},
            ]}>
            <Text style={styles.severityText}>
              {getSeverityLabel(item.severity)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.reportDescription}>{item.description}</Text>

      <View style={styles.reportFooter}>
        <Text style={styles.reportLocation}>{item.location.address}</Text>
        <View style={styles.reportMeta}>
          <Text style={styles.reportedBy}>By {item.reportedBy}</Text>
          <Text style={styles.reportTime}>{item.timestamp}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Card title="Community Sentinel Network">
      <View style={styles.container}>
        {/* Prediction Time Picker */}
        <View style={styles.timePickerContainer}>
          <PredictionTimePicker showCard={false} compact={true} />
        </View>
        {/* Stats Strip */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{reports.length}</Text>
            <Text style={styles.statLabel}>Local Reports</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {reports.filter(r => r.verified).length}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.round(
                (reports.filter(r => r.verified).length / reports.length) * 100,
              )}
              %
            </Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setShowReportModal(true)}>
            <Text style={styles.reportButtonText}>📝 Submit Report</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllButtonText}>🗺️ View on Map</Text>
          </TouchableOpacity> */}
        </View>

        {/* Recent Reports */}
        <View style={styles.reportsHeader}>
          <Text style={styles.reportsTitle}>Recent Community Reports</Text>
        </View>

        <FlatList
          data={reports.slice(0, 3)}
          renderItem={renderReportItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={[styles.reportsList, {height: 300}]}
        />

        {/* Report Modal */}
        <Modal
          visible={showReportModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowReportModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Submit Community Report</Text>
                <TouchableOpacity
                  onPress={() => setShowReportModal(false)}
                  style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Report Type Selection */}
                <Text style={styles.sectionTitle}>Report Type</Text>
                <View style={styles.typeSelectionContainer}>
                  {[
                    {key: 'air-quality', label: 'Air Quality', icon: '💨'},
                    {
                      key: 'pollution-source',
                      label: 'Pollution Source',
                      icon: '🏭',
                    },
                    {key: 'weather', label: 'Weather', icon: '🌤️'},
                  ].map(type => (
                    <TouchableOpacity
                      key={type.key}
                      style={[
                        styles.typeOption,
                        reportType === type.key && styles.selectedTypeOption,
                      ]}
                      onPress={() => setReportType(type.key as any)}>
                      <Text style={styles.typeOptionIcon}>{type.icon}</Text>
                      <Text
                        style={[
                          styles.typeOptionText,
                          reportType === type.key &&
                            styles.selectedTypeOptionText,
                        ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Severity Selection */}
                <Text style={styles.sectionTitle}>Severity Level</Text>
                <View style={styles.severityContainer}>
                  {[1, 2, 3, 4, 5].map(level => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.severityOption,
                        severity === level && styles.selectedSeverityOption,
                        {
                          backgroundColor:
                            severity === level
                              ? getSeverityColor(level)
                              : '#f0f0f0',
                        },
                      ]}
                      onPress={() => setSeverity(level)}>
                      <Text
                        style={[
                          styles.severityOptionText,
                          severity === level &&
                            styles.selectedSeverityOptionText,
                        ]}>
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.severityNote}>
                  1 = Minimal impact, 5 = Severe impact
                </Text>

                {/* Description */}
                <Text style={styles.sectionTitle}>Description</Text>
                <TextInput
                  style={styles.descriptionInput}
                  placeholder="Describe what you've observed..."
                  value={description}
                  onChangeText={setDescription}
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                {/* Location Info */}
                <Text style={styles.sectionTitle}>Location</Text>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationText}>
                    {currentLocation.address}
                  </Text>
                  <Text style={styles.coordinatesText}>
                    {currentLocation.latitude.toFixed(4)},{' '}
                    {currentLocation.longitude.toFixed(4)}
                  </Text>
                </View>
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (!description.trim() || submitting) &&
                    styles.submitButtonDisabled,
                ]}
                onPress={submitReport}
                disabled={!description.trim() || submitting}>
                <Text style={styles.submitButtonText}>
                  {submitting ? 'Submitting...' : 'Submit Report'}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  reportButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  reportButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  viewAllButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  viewAllButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  reportsHeader: {
    marginBottom: 10,
  },
  reportsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reportsList: {
    maxHeight: 300,
  },
  reportItem: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  reportType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifiedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  verifiedText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  severityText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '500',
  },
  reportDescription: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
    lineHeight: 18,
  },
  reportFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
  },
  reportLocation: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  reportMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportedBy: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  reportTime: {
    fontSize: 12,
    color: colors.textLight,
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
    maxHeight: '90%',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  modalBody: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
    marginTop: 10,
  },
  typeSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  typeOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: colors.white,
  },
  selectedTypeOption: {
    borderColor: colors.primary,
    backgroundColor: '#f0f8ff',
  },
  typeOptionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  typeOptionText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  selectedTypeOptionText: {
    color: colors.primary,
    fontWeight: '600',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  severityOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSeverityOption: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  severityOptionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
  },
  selectedSeverityOptionText: {
    color: colors.white,
  },
  severityNote: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 10,
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: colors.white,
    minHeight: 100,
  },
  locationInfo: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  coordinatesText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: colors.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  timePickerContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
});

export default CommunitySentinel;
