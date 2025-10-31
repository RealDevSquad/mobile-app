import { ExtensionRequestDTO } from '@/api/extension-requests/extension-request.dto';
import { formatDate, getRelativeTime } from '@/common/utils/dateUtils';
import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface ExtensionRequestCardProps {
  request: ExtensionRequestDTO;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const ExtensionRequestCard: React.FC<ExtensionRequestCardProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const formatTimeAgo = (timestamp: number) => {
    const currentUnix = Math.floor(Date.now() / 1000);
    return getRelativeTime(timestamp, currentUnix);
  };

  const handleApprove = async () => {
    Alert.alert(
      'Approve Extension Request',
      'Are you sure you want to approve this extension request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: async () => {
            setIsApproving(true);
            try {
              await onApprove(request.id);
              Alert.alert(
                'Success',
                'Extension request approved successfully.'
              );
            } catch {
              Alert.alert('Error', 'Failed to approve extension request.');
            } finally {
              setIsApproving(false);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      'Reject Extension Request',
      'Are you sure you want to reject this extension request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            setIsRejecting(true);
            try {
              await onReject(request.id);
              Alert.alert(
                'Success',
                'Extension request rejected successfully.'
              );
            } catch {
              Alert.alert('Error', 'Failed to reject extension request.');
            } finally {
              setIsRejecting(false);
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#FFA500';
      case 'APPROVED':
        return '#4CAF50';
      case 'REJECTED':
      case 'DENIED':
        return '#F44336';
      default:
        return '#666';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setIsExpanded(!isExpanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>{request.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(request.status) },
            ]}
          >
            <Text style={styles.statusText}>{request.status}</Text>
          </View>
        </View>
        <FontAwesome
          name="chevron-down"
          size={20}
          color="#666"
          style={[
            styles.arrowIcon,
            { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] },
          ]}
        />
      </View>

      <Text style={styles.text}>
        Assignee: <Text style={styles.assignee}>{request.assignee}</Text>
      </Text>

      <Text style={styles.text}>Request #{request.requestNumber}</Text>

      <Text style={styles.text}>
        Old End Date:{' '}
        <Text style={styles.date}>{formatDate(request.oldEndsOn)}</Text>
      </Text>

      <Text style={styles.text}>
        New End Date:{' '}
        <Text style={styles.date}>{formatDate(request.newEndsOn)}</Text>
      </Text>

      <Text style={styles.text}>
        Reason:{' '}
        <Text style={styles.reason}>
          {isExpanded ? request.reason : truncateText(request.reason, 100)}
        </Text>
      </Text>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={styles.text}>
            Task ID: <Text style={styles.taskId}>{request.taskId}</Text>
          </Text>

          <Text style={styles.text}>
            Submitted:{' '}
            <Text style={styles.timestamp}>
              {formatTimeAgo(request.timestamp)}
            </Text>
          </Text>

          {request.status === 'PENDING' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                key={`approve-${request.id}`}
                style={[
                  styles.button,
                  styles.approveButton,
                  (isApproving || isRejecting) && styles.disabledButton,
                ]}
                onPress={handleApprove}
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Approve</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                key={`reject-${request.id}`}
                style={[
                  styles.button,
                  styles.rejectButton,
                  (isApproving || isRejecting) && styles.disabledButton,
                ]}
                onPress={handleReject}
                disabled={isApproving || isRejecting}
              >
                {isRejecting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>Reject</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

ExtensionRequestCard.displayName = 'ExtensionRequestCard';

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    margin: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadow.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    paddingVertical: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.primary[700],
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  arrowIcon: {
    marginLeft: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.xl,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
  },
  text: {
    fontSize: theme.typography.fontSize.base,
    marginBottom: 6,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  assignee: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  date: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  reason: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: 20,
  },
  expandedContent: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
  },
  taskId: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.mono,
  },
  timestamp: {
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.regular,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  approveButton: {
    backgroundColor: theme.colors.success[500],
  },
  rejectButton: {
    backgroundColor: theme.colors.error[500],
  },
  buttonText: {
    color: theme.colors.text.inverted,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.bold,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ExtensionRequestCard;
