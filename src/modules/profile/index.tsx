import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useAuthStore } from "../../store/authStore";
import { formatDateFull, getInitials } from "../../utils/common.utils";
import { secureStorage } from "../../utils/storage";
import { LogoutModal } from "./logout-modal";
import styles from "./profile.styles";

export function ProfileModule() {
  const { data: user, isLoading, error } = useCurrentUser();
  const { logout } = useAuthStore();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogout = async () => {
    await secureStorage.removeItem("auth_token");
    logout();
    setLogoutModalVisible(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E30464" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load profile</Text>
        </View>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No user data available</Text>
        </View>
      </View>
    );
  }

  const initials = getInitials(user.first_name, user.last_name, user.username);
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            {user.picture?.url ? (
              <Image source={{ uri: user.picture.url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>{initials}</Text>
              </View>
            )}
          </View>
          <Text style={styles.fullName}>{fullName}</Text>
          {!!user.username && <Text style={styles.username}>@{user.username}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            {!!user.first_name && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <FontAwesome5 name="user" size={14} color="#E30464" />
                  <Text style={styles.infoLabel}>First Name</Text>
                </View>
                <Text style={styles.infoValue}>{user.first_name}</Text>
              </View>
            )}
            {!!user.last_name && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <FontAwesome5 name="user" size={14} color="#E30464" />
                  <Text style={styles.infoLabel}>Last Name</Text>
                </View>
                <Text style={styles.infoValue}>{user.last_name}</Text>
              </View>
            )}
            {!!user.username && (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <View style={styles.infoLabelContainer}>
                  <FontAwesome5 name="at" size={14} color="#E30464" />
                  <Text style={styles.infoLabel}>Username</Text>
                </View>
                <Text style={styles.infoValue}>@{user.username}</Text>
              </View>
            )}
          </View>
        </View>

        {(!!user.company || !!user.designation) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Information</Text>
            <View style={styles.card}>
              {!!user.company && (
                <View style={styles.infoRow}>
                  <View style={styles.infoLabelContainer}>
                    <FontAwesome5 name="building" size={14} color="#E30464" />
                    <Text style={styles.infoLabel}>Company</Text>
                  </View>
                  <Text style={styles.infoValue}>{user.company}</Text>
                </View>
              )}
              {!!user.designation && (
                <View style={[styles.infoRow, styles.infoRowLast]}>
                  <View style={styles.infoLabelContainer}>
                    <FontAwesome5 name="briefcase" size={14} color="#E30464" />
                    <Text style={styles.infoLabel}>Designation</Text>
                  </View>
                  <Text style={styles.infoValue}>{user.designation}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {(!!user.github_id || !!user.linkedin_id || !!user.twitter_id || !!user.discordId) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Social Links</Text>
            <View style={styles.card}>
              <View style={styles.socialLinksContainer}>
                {!!user.github_id && (
                  <View style={styles.socialLink}>
                    <FontAwesome5 name="github" size={16} color="#1F2937" />
                    <Text style={styles.socialLinkText}>GitHub</Text>
                  </View>
                )}
                {!!user.linkedin_id && (
                  <View style={styles.socialLink}>
                    <FontAwesome5 name="linkedin" size={16} color="#1F2937" />
                    <Text style={styles.socialLinkText}>LinkedIn</Text>
                  </View>
                )}
                {!!user.twitter_id && (
                  <View style={styles.socialLink}>
                    <FontAwesome5 name="twitter" size={16} color="#1F2937" />
                    <Text style={styles.socialLinkText}>Twitter</Text>
                  </View>
                )}
                {!!user.discordId && (
                  <View style={styles.socialLink}>
                    <FontAwesome5 name="discord" size={16} color="#1F2937" />
                    <Text style={styles.socialLinkText}>Discord</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.card}>
            {!!user.created_at && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <FontAwesome5 name="calendar-alt" size={14} color="#E30464" />
                  <Text style={styles.infoLabel}>Member Since</Text>
                </View>
                <Text style={styles.infoValue}>{formatDateFull(user.created_at)}</Text>
              </View>
            )}
            {!!user.profileStatus && (
              <View style={styles.infoRow}>
                <View style={styles.infoLabelContainer}>
                  <FontAwesome5 name="info-circle" size={14} color="#E30464" />
                  <Text style={styles.infoLabel}>Status</Text>
                </View>
                <Text style={styles.infoValue}>{user.profileStatus}</Text>
              </View>
            )}
            {!!user.website && (
              <View style={[styles.infoRow, styles.infoRowLast]}>
                <View style={styles.infoLabelContainer}>
                  <FontAwesome5 name="globe" size={14} color="#E30464" />
                  <Text style={styles.infoLabel}>Website</Text>
                </View>
                <Text style={styles.infoValue}>{user.website}</Text>
              </View>
            )}
          </View>
        </View>

        {!!user.roles && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Roles</Text>
            <View style={styles.card}>
              <View style={styles.rolesContainer}>
                {user.roles.member && (
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>Member</Text>
                  </View>
                )}
                {user.roles.super_user && (
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>Super User</Text>
                  </View>
                )}
                {user.roles.in_discord && (
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>In Discord</Text>
                  </View>
                )}
                {user.roles.archived && (
                  <View style={styles.roleBadge}>
                    <Text style={styles.roleBadgeText}>Archived</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => setLogoutModalVisible(true)}
        >
          <FontAwesome5 name="sign-out-alt" size={16} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </ScrollView>

      <LogoutModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}
