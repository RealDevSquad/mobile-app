import { theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/common/utils/dateUtils';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ExtensionRequestDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  extensionDetails: {
    title: string;
    reason: string;
    oldEndsOn: number;
    newEndsOn: number;
    status: string;
    requestNumber: number;
    timestamp: number;
  } | null;
}

const ExtensionRequestDetailsModal: React.FC<
  ExtensionRequestDetailsModalProps
> = ({ visible, onClose, extensionDetails }) => {
  if (!visible || !extensionDetails) return null;

  // Using formatDate from dateUtils

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return theme.colors.warning[500];
      case 'APPROVED':
        return theme.colors.success[500];
      case 'REJECTED':
      case 'DENIED':
        return theme.colors.error[500];
      default:
        return theme.colors.gray[500];
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Extension Request Details</Text>
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={onClose}
            testID="close-button"
          >
            <Ionicons
              name="close"
              size={20}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(extensionDetails.status) },
              ]}
            >
              <Text style={styles.statusText}>{extensionDetails.status}</Text>
            </View>
            <Text style={styles.requestNumber}>
              Request #{extensionDetails.requestNumber}
            </Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Title</Text>
            <Text style={styles.detailValue}>{extensionDetails.title}</Text>
          </View>

          <View style={styles.detailSection}>
            <Text style={styles.detailLabel}>Reason</Text>
            <Text style={styles.detailValue}>{extensionDetails.reason}</Text>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.rowItem}>
              <Text style={styles.detailLabel}>Current Deadline</Text>
              <Text style={styles.detailValue}>
                {formatDate(extensionDetails.oldEndsOn)}
              </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.detailLabel}>Requested Deadline</Text>
              <Text style={styles.detailValue}>
                {formatDate(extensionDetails.newEndsOn)}
              </Text>
            </View>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.rowItem}>
              <Text style={styles.detailLabel}>Extension Duration</Text>
              <Text style={styles.detailValue}>
                {Math.ceil(
                  (extensionDetails.newEndsOn - extensionDetails.oldEndsOn) /
                    (24 * 60 * 60)
                )}{' '}
                days
              </Text>
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.detailLabel}>Submitted On</Text>
              <Text style={styles.detailValue}>
                {formatDate(extensionDetails.timestamp)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxWidth: 450,
    maxHeight: '75%',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    ...theme.shadow.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  closeIcon: {
    padding: theme.spacing.xs,
    marginLeft: theme.spacing.sm,
  },
  content: {
    maxHeight: 350,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  rowItem: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.lg,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
  },
  requestNumber: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  detailSection: {
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    lineHeight:
      theme.typography.lineHeight.normal * theme.typography.fontSize.base,
  },
  closeButton: {
    backgroundColor: theme.colors.legacy.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  closeButtonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default ExtensionRequestDetailsModal;
