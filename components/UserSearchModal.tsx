import { UsersApi } from '@/api/users/users.api';
import { theme } from '@/constants/theme';
import useCheckUserSession from '@/hooks/getUserToken';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

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
  const { token } = useCheckUserSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Search users when debounced term changes
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: UsersApi.searchUsers.key(debouncedSearchTerm),
    queryFn: () =>
      UsersApi.searchUsers.fn(debouncedSearchTerm, token || undefined),
    enabled: !!token && debouncedSearchTerm.length >= 3,
  });

  const handleUserSelect = useCallback(
    (username: string) => {
      onUserSelect(username);
      onClose();
    },
    [onUserSelect, onClose]
  );

  const handleClose = useCallback(() => {
    setSearchTerm('');
    onClose();
  }, [onClose]);

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
          (!searchResults || searchResults.users?.length === 0) && (
            <View style={styles.messageContainer}>
              <Text style={styles.messageText}>No users found</Text>
            </View>
          )}

        {searchResults?.users && searchResults.users.length > 0 && (
          <FlatList
            data={searchResults.users}
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
    backgroundColor: theme.colors.surface.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  closeButtonText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.info[500],
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  placeholder: {
    width: 60,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    backgroundColor: theme.colors.background.primary,
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  loadingText: {
    marginLeft: theme.spacing.sm,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
  },
  messageContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  messageText: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  userList: {
    flex: 1,
  },
  userItem: {
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.base,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  userUsername: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.secondary,
    marginBottom: 2,
  },
  userCompany: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.tertiary,
  },
});

export default UserSearchModal;
