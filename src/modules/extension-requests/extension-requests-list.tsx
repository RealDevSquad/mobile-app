import { useQuery } from "@tanstack/react-query";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { ExtensionRequestsApi } from "../../api/extension-requests/extension-requests.api";
import { ExtensionRequestCard } from "./extension-request-card";
import styles from "./extension-requests.styles";

const SKELETON_COUNT = 5;

type ExtensionRequestStatus = "PENDING" | "APPROVED" | "DENIED";

type ExtensionRequestsListProps = {
  status: ExtensionRequestStatus;
};

const getStatusLabel = (status: ExtensionRequestStatus): string => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "APPROVED":
      return "approved";
    case "DENIED":
      return "rejected";
    default:
      return "pending";
  }
};

export function ExtensionRequestsList({ status }: ExtensionRequestsListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ExtensionRequestsApi.getExtensionRequests.key({ status }),
    queryFn: () => ExtensionRequestsApi.getExtensionRequests.fn({ status }),
  });

  if (isLoading) {
    return (
      <View style={styles.listContainer}>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <View key={`skeleton-${status}-${index}`} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View
                style={{ height: 20, width: "70%", backgroundColor: "#E5E7EB", borderRadius: 4 }}
              />
              <View
                style={{ height: 24, width: 80, backgroundColor: "#E5E7EB", borderRadius: 6 }}
              />
            </View>
            <View
              style={{
                height: 14,
                width: "50%",
                backgroundColor: "#E5E7EB",
                borderRadius: 4,
                marginBottom: 12,
              }}
            />
            <View
              style={{ height: 14, width: "40%", backgroundColor: "#E5E7EB", borderRadius: 4 }}
            />
          </View>
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome5 name="exclamation-circle" size={48} color="#EF4444" />
        <Text style={styles.errorText}>
          Failed to load {getStatusLabel(status)} extension requests
        </Text>
      </View>
    );
  }

  const extensionRequests = data?.allExtensionRequests || [];

  if (extensionRequests.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <FontAwesome5 name="inbox" size={48} color="#9CA3AF" />
        <Text style={styles.emptyText}>No {getStatusLabel(status)} extension requests found</Text>
        <Text style={styles.emptySubtext}>
          {getStatusLabel(status).charAt(0).toUpperCase() + getStatusLabel(status).slice(1)}{" "}
          extension requests will appear here when available
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={extensionRequests}
      renderItem={({ item }) => <ExtensionRequestCard extensionRequest={item} />}
      keyExtractor={(item) => item.id}
      style={{ flex: 1, backgroundColor: "#FFFFFF" }}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}
