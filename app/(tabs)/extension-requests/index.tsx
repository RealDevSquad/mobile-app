import ExtensionRequestCard from "@/components/ExtensionRequestCard";
import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ExtensionRequestsScreen: React.FC = () => {
  const {
    extensionRequests,
    hasMoreExtensionRequests,
    extensionRequestsFilter,
    loading,
    error,
    fetchExtensionRequests,
    approveExtensionRequest,
    rejectExtensionRequest,
    setExtensionRequestsFilter,
  } = useUserStore();

  const { token } = useCheckUserSession();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  const filterOptions = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
    { label: "Denied", value: "DENIED" },
  ];

  useEffect(() => {
    if (token) {
      fetchExtensionRequests(token, extensionRequestsFilter);
    }
  }, [token, extensionRequestsFilter, fetchExtensionRequests]);

  const handleLoadMore = async () => {
    if (!token || !hasMoreExtensionRequests || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await fetchExtensionRequests(
        token,
        extensionRequestsFilter,
        useUserStore.getState().extensionRequestsNext
      );
    } catch (error) {
      console.error("Error loading more extension requests:", error);
      Alert.alert("Error", "Failed to load more extension requests.");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!token) return;
    try {
      await approveExtensionRequest(id, token);
    } catch (error) {
      console.error("Error approving extension request:", error);
      throw error; // Re-throw to be handled by the card component
    }
  };

  const handleReject = async (id: string) => {
    if (!token) return;
    try {
      await rejectExtensionRequest(id, token);
    } catch (error) {
      console.error("Error rejecting extension request:", error);
      throw error; // Re-throw to be handled by the card component
    }
  };

  const handleFilterChange = (filter: string) => {
    setExtensionRequestsFilter(filter);
    setShowFilterModal(false);
  };

  const renderExtensionRequest = ({ item }: { item: any }) => (
    <ExtensionRequestCard
      request={item}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );

  const renderLoadMoreButton = () => {
    if (!hasMoreExtensionRequests) return null;

    return (
      <TouchableOpacity
        style={styles.loadMoreButton}
        onPress={handleLoadMore}
        disabled={isLoadingMore}
      >
        {isLoadingMore ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loadMoreText}>Load More</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Filter by Status</Text>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterOption,
                extensionRequestsFilter === option.value &&
                  styles.selectedFilterOption,
              ]}
              onPress={() => handleFilterChange(option.value)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  extensionRequestsFilter === option.value &&
                    styles.selectedFilterOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowFilterModal(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (!token || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={async () => {
            if (token && !isRetrying) {
              setIsRetrying(true);
              try {
                await fetchExtensionRequests(token, extensionRequestsFilter);
              } catch (error) {
                console.error("Error retrying:", error);
              } finally {
                setIsRetrying(false);
              }
            }
          }}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.retryButtonText}>Retry</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>
            Filter:{" "}
            {
              filterOptions.find((opt) => opt.value === extensionRequestsFilter)
                ?.label
            }
          </Text>
        </TouchableOpacity>
      </View>

      {extensionRequests.length > 0 ? (
        <FlatList
          data={extensionRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderExtensionRequest}
          ListFooterComponent={renderLoadMoreButton}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No extension requests found</Text>
          <Text style={styles.emptySubtext}>
            Try changing the filter or check back later
          </Text>
        </View>
      )}

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  filterButton: {
    backgroundColor: "#1D1283",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  loadMoreButton: {
    backgroundColor: "#1D1283",
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loadMoreText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#F44336",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#1D1283",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: "center",
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedFilterOption: {
    backgroundColor: "#1D1283",
    borderColor: "#1D1283",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  selectedFilterOptionText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: "#666",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ExtensionRequestsScreen;
