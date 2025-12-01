import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { ExtensionRequestDTO } from "../../api/extension-requests/extension-request.dto";
import { ActionButton, Sheet } from "../../components/Sheet";
import { formatDateWithTime } from "../../utils/common.utils";
import { EditExtensionRequestModal } from "./edit-extension-request-modal";
import styles from "./extension-request-modal.styles";

type ExtensionRequestDetailsModalProps = {
  visible: boolean;
  onClose: () => void;
  extensionRequest: ExtensionRequestDTO;
  taskId: string;
};

export function ExtensionRequestDetailsModal({
  visible,
  onClose,
  extensionRequest,
  taskId,
}: ExtensionRequestDetailsModalProps) {
  const [editModalVisible, setEditModalVisible] = useState(false);

  const actionButtons: ActionButton[] = [
    ...(extensionRequest.status === "PENDING"
      ? [
          {
            label: "Edit",
            onPress: () => setEditModalVisible(true),
            variant: "primary" as const,
          },
        ]
      : []),
    {
      label: "Close",
      onPress: onClose,
      variant: "secondary" as const,
    },
  ];

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      heading="Extension Request Details"
      icon={<FontAwesome5 name="info-circle" size={20} color="#E30464" />}
      actionButtons={actionButtons}
      height={90}
    >
      <View style={styles.formGroup}>
        <Text style={styles.label}>Request Number</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>#{extensionRequest.requestNumber}</Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>{extensionRequest.title}</Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Reason</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>{extensionRequest.reason}</Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Current End Date</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>
            {formatDateWithTime(extensionRequest.oldEndsOn)}
          </Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>New End Date</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>
            {formatDateWithTime(extensionRequest.newEndsOn)}
          </Text>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Submitted On</Text>
        <View style={styles.displayValue}>
          <Text style={styles.displayValueText}>
            {formatDateWithTime(extensionRequest.timestamp)}
          </Text>
        </View>
      </View>

      {editModalVisible && (
        <EditExtensionRequestModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
          }}
          extensionRequest={extensionRequest}
          taskId={taskId}
          onUpdateSuccess={() => {
            setEditModalVisible(false);
          }}
        />
      )}
    </Sheet>
  );
}
