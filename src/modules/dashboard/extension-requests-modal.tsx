import { useQuery } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { ExtensionRequestsApi } from "../../api/extension-requests/extension-requests.api";
import { formatDateShort } from "../../utils/common.utils";
import { Sheet } from "../../components/Sheet";
import styles from "./extension-requests-modal.styles";

type ExtensionRequestsModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function ExtensionRequestsModal({ visible, onClose }: ExtensionRequestsModalProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ExtensionRequestsApi.getExtensionRequests.key({ status: "PENDING" }),
    queryFn: () => ExtensionRequestsApi.getExtensionRequests.fn({ status: "PENDING" }),
  });

  const extensionRequests = data?.allExtensionRequests || [];

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading extension requests...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome5 name="exclamation-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>Failed to load extension requests</Text>
        </View>
      );
    }

    if (extensionRequests.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <FontAwesome5 name="inbox" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No extension requests found</Text>
          <Text style={styles.emptySubtext}>
            Extension requests will appear here when available
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={extensionRequests}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.requestTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  item.status === "APPROVED" && styles.statusApproved,
                  item.status === "DENIED" && styles.statusRejected,
                  item.status === "PENDING" && styles.statusPending,
                ]}
              >
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.requestMeta}>
              Request #{item.requestNumber} • {formatDateShort(item.timestamp)}
            </Text>
            <View style={styles.datesContainer}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>Old Deadline:</Text>
                <Text style={styles.dateValue}>{formatDateShort(item.oldEndsOn)}</Text>
              </View>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>New Deadline:</Text>
                <Text style={styles.dateValue}>{formatDateShort(item.newEndsOn)}</Text>
              </View>
            </View>
            {!!item.reason && (
              <View style={styles.reasonContainer}>
                <Text style={styles.reasonLabel}>Reason:</Text>
                <Text style={styles.reasonText} numberOfLines={3}>
                  {item.reason}
                </Text>
              </View>
            )}
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      heading="Extension Requests"
      icon={<FontAwesome5 name="calendar-plus" size={20} color="#3B82F6" />}
      actionButtons={[]}
    >
      {renderContent()}
    </Sheet>
  );
}
