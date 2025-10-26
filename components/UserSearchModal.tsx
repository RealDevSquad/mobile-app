import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface UserSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onUserSelect: (username: string) => void;
}

const UserSearchModal: React.FC<UserSearchModalProps> = ({
  visible,
  onClose,
  onUserSelect,
}) => {
  const { searchResults, loadingSearch, searchUsers, clearSearchResults } =
    useUserStore();
  const { token } = useCheckUserSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search users when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= 3 && token) {
      searchUsers(token, debouncedSearchTerm);
    } else if (debouncedSearchTerm.length < 3) {
      clearSearchResults();
    }
  }, [debouncedSearchTerm, token, searchUsers, clearSearchResults]);

  const handleUserSelect = (username: string) => {
    onUserSelect(username);
    onClose();
  };

  const handleClose = () => {
    setSearchTerm("");
    clearSearchResults();
    onClose();
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserSelect(item.username)}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>
          {item.first_name} {item.last_name}
        </Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
        {item.company && <Text style={styles.userCompany}>{item.company}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Search Users</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search users (min 3 characters)..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoFocus
          />
        </View>

        {loadingSearch && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}

        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>
              Please enter at least 3 characters to search
            </Text>
          </View>
        )}

        {searchTerm.length >= 3 &&
          !loadingSearch &&
          searchResults.length === 0 && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>No users found</Text>
            </View>
          )}

        {searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id}
            renderItem={renderUserItem}
            style={styles.userList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  placeholder: {
    width: 60,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 14,
  },
  messageContainer: {
    padding: 20,
    alignItems: "center",
  },
  messageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  userList: {
    flex: 1,
  },
  userItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 4,
  },
  userUsername: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 2,
  },
  userCompany: {
    fontSize: 12,
    color: "#999999",
  },
});

export default UserSearchModal;
