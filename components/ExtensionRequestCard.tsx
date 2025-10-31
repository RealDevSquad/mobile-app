import { ExtensionRequestDTO } from '@/api/extension-requests/extension-request.dto';
import { formatTimeAgo, getRelativeFromNow } from '@/common/utils/dateUtils';
import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

interface ExtensionRequestCardProps {
  request: ExtensionRequestDTO;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return theme.colors.warning[500];
    case 'APPROVED':
      return theme.colors.success[500];
    case 'REJECTED':
    case 'DENIED':
      return theme.colors.error[500];
    default:
      return theme.colors.text.secondary;
  }
}

const ExtensionRequestCard: React.FC<ExtensionRequestCardProps> = ({
  request,
  onApprove,
  onReject,
}) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isReasonExpanded, setIsReasonExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const animatedOpacity = useRef(new Animated.Value(0)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  const statusColor = getStatusColor(request.status);
  const newEndDate = getRelativeFromNow(request.newEndsOn);
  const oldEndDate = getRelativeFromNow(request.oldEndsOn);
  const submittedAgo = formatTimeAgo(request.timestamp);

  // Enable LayoutAnimation on Android
  if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
  ) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    // Configure smooth layout animation
    LayoutAnimation.configureNext({
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    Animated.parallel([
      Animated.timing(animatedHeight, {
        toValue: isReasonExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(animatedOpacity, {
        toValue: isReasonExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnimation, {
        toValue: isReasonExpanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isReasonExpanded, animatedHeight, animatedOpacity, rotateAnimation]);

  const maxHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
  });

  const iconRotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleApprove = () => {
    Alert.alert(
      'Approve Extension Request',
      'Are you sure you want to approve this extension request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          style: 'default',
          onPress: () => {
            setIsApproving(true);
            onApprove(request.id)
              .then(() => {
                Alert.alert(
                  'Success',
                  'Extension request approved successfully.'
                );
              })
              .catch(() => {
                Alert.alert('Error', 'Failed to approve extension request.');
              })
              .finally(() => {
                setIsApproving(false);
              });
          },
        },
      ]
    );
  };

  const handleReject = () => {
    Alert.alert(
      'Reject Extension Request',
      'Are you sure you want to reject this extension request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: () => {
            setIsRejecting(true);
            onReject(request.id)
              .then(() => {
                Alert.alert(
                  'Success',
                  'Extension request rejected successfully.'
                );
              })
              .catch(() => {
                Alert.alert('Error', 'Failed to reject extension request.');
              })
              .finally(() => {
                setIsRejecting(false);
              });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {request.title}
          </Text>
        </View>
        <View style={styles.rightColumn}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {request.status === 'DENIED' ? 'REJECTED' : request.status}
          </Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
      </View>

      <View style={styles.contentRow}>
        <View style={styles.leftColumn}>
          <Text style={styles.label}>
            Assigned to <Text style={styles.strong}>{request.assignee}</Text>
          </Text>

          <Text style={styles.subtle}>
            Old Deadline: <Text style={styles.strong}>{oldEndDate}</Text>
          </Text>

          <Text style={styles.subtle}>
            New Deadline: <Text style={styles.strong}>{newEndDate}</Text>
          </Text>

          <View style={styles.metaRow}>
            <Text style={styles.subtle}>
              Submitted <Text style={styles.strong}>{submittedAgo}</Text>
            </Text>
            <Text style={styles.requestNumber}>#{request.requestNumber}</Text>
          </View>
        </View>
      </View>

      <Animated.View
        style={[
          styles.expandedReasonSection,
          {
            maxHeight,
            opacity: animatedOpacity,
            overflow: 'hidden',
          },
        ]}
      >
        <View style={styles.reasonContent}>
          <Text style={styles.reasonLabel}>Reason:</Text>
          <Text style={styles.reasonText}>{request.reason}</Text>

          {request.status === 'PENDING' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity
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
      </Animated.View>

      <TouchableOpacity
        style={styles.expandButton}
        onPress={() => setIsReasonExpanded(!isReasonExpanded)}
        activeOpacity={0.7}
      >
        <Animated.View
          style={{
            transform: [{ rotate: iconRotate }],
          }}
        >
          <FontAwesome
            name="chevron-down"
            size={12}
            color={theme.colors.text.secondary}
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

ExtensionRequestCard.displayName = 'ExtensionRequestCard';

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.sm,
    marginVertical: theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
    ...theme.shadow.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  titleContainer: {
    width: '60%',
    paddingRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingLeft: theme.spacing.md,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
    marginRight: theme.spacing.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 2,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  strong: {
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.medium,
  },
  subtle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily.regular,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  expandedReasonSection: {
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.secondary,
  },
  reasonContent: {
    paddingTop: theme.spacing.sm,
  },
  reasonLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily.medium,
    marginBottom: theme.spacing.xs,
  },
  reasonText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.primary,
    fontFamily: theme.typography.fontFamily.regular,
    lineHeight: 18,
    marginBottom: theme.spacing.sm,
  },
  expandButton: {
    alignSelf: 'center',
    marginTop: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  requestNumber: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary[600],
    fontFamily: theme.typography.fontFamily.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  button: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
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
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.bold,
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default ExtensionRequestCard;
