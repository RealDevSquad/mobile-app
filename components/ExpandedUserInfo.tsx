import { UserData } from '@/api/users/user.dto';
import { formatDateFromMillis } from '@/common/utils/dateUtils';
import { theme } from '@/constants/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SocialLinks from './SocialLinks';

interface ExpandedUserInfoProps {
  userData: UserData;
}

const ExpandedUserInfo: React.FC<ExpandedUserInfoProps> = ({ userData }) => {
  const formatTimestamp = (timestamp: number) => {
    if (!timestamp || timestamp <= 0) return 'Not available';
    const ts = timestamp > 1e10 ? timestamp : timestamp * 1000;
    return formatDateFromMillis(ts);
  };

  const formatDiscordDate = (dateString: string) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return 'Not available';
      return formatDateFromMillis(date.getTime());
    } catch {
      return 'Not available';
    }
  };

  const getRoleBadges = () => {
    const badges = [];
    if (userData.roles?.super_user)
      badges.push({ label: 'Super User', color: theme.colors.secondary[600] });
    if (userData.roles?.member)
      badges.push({ label: 'Member', color: theme.colors.success[500] });
    if (userData.roles?.archived)
      badges.push({ label: 'Archived', color: theme.colors.gray[500] });
    if (userData.roles?.in_discord)
      badges.push({ label: 'In Discord', color: theme.colors.info[500] });
    return badges;
  };

  const roleBadges = getRoleBadges();

  const hasDiscordInfo = !!(userData.discordId || userData.discordJoinedAt);
  const hasSocialLinks = !!(
    userData.github_id ||
    userData.twitter_id ||
    userData.linkedin_id
  );

  return (
    <View style={styles.container}>
      {/* Roles Section - Show at top if available */}
      {roleBadges.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome
              name="shield"
              size={18}
              color={theme.colors.primary[600]}
            />
            <Text style={styles.sectionTitle}>Roles & Status</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.badgeContainer}>
              {roleBadges.map((badge) => (
                <View
                  key={`badge-${badge.label}`}
                  style={[styles.badge, { backgroundColor: badge.color }]}
                >
                  <Text style={styles.badgeText}>{badge.label}</Text>
                </View>
              ))}
              {userData.incompleteUserDetails && (
                <View style={[styles.badge, styles.warningBadge]}>
                  <Text style={styles.badgeText}>Profile Incomplete</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Basic Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome
            name="user"
            size={18}
            color={theme.colors.primary[600]}
          />
          <Text style={styles.sectionTitle}>Basic Information</Text>
        </View>
        <View style={styles.card}>
          {!!userData.username && (
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <FontAwesome
                  name="at"
                  size={14}
                  color={theme.colors.text.secondary}
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>Username</Text>
              </View>
              <Text style={styles.value}>@{userData.username}</Text>
            </View>
          )}
          {!!userData.designation && (
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <FontAwesome
                  name="briefcase"
                  size={14}
                  color={theme.colors.text.secondary}
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>Designation</Text>
              </View>
              <Text style={styles.value}>{userData.designation}</Text>
            </View>
          )}
          {!!userData.company && (
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <FontAwesome
                  name="building"
                  size={14}
                  color={theme.colors.text.secondary}
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>Company</Text>
              </View>
              <Text style={styles.value}>{userData.company}</Text>
            </View>
          )}
          {!!userData.profileStatus && (
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <FontAwesome
                  name="info-circle"
                  size={14}
                  color={theme.colors.text.secondary}
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>Profile Status</Text>
              </View>
              <Text style={styles.value}>{userData.profileStatus}</Text>
            </View>
          )}
        </View>
      </View>

      {/* GitHub Information Section */}
      {(!!userData.github_display_name || !!userData.website) && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome
              name="github"
              size={18}
              color={theme.colors.primary[600]}
            />
            <Text style={styles.sectionTitle}>GitHub & Links</Text>
          </View>
          <View style={styles.card}>
            {!!userData.github_display_name && (
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <FontAwesome
                    name="user-circle"
                    size={14}
                    color={theme.colors.text.secondary}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.label}>Display Name</Text>
                </View>
                <Text style={styles.value}>{userData.github_display_name}</Text>
              </View>
            )}
            {!!userData.website && (
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <FontAwesome
                    name="globe"
                    size={14}
                    color={theme.colors.text.secondary}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.label}>Website</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const url = userData.website.startsWith('http')
                      ? userData.website
                      : `https://${userData.website}`;
                    Linking.openURL(url).catch((err) =>
                      console.error('Failed to open URL:', err)
                    );
                  }}
                >
                  <Text style={[styles.value, styles.link]} numberOfLines={1}>
                    {userData.website}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Discord Information Section */}
      {hasDiscordInfo && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome
              name="comment"
              size={18}
              color={theme.colors.primary[600]}
            />
            <Text style={styles.sectionTitle}>Discord</Text>
          </View>
          <View style={styles.card}>
            {!!userData.discordId && (
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <FontAwesome
                    name="hashtag"
                    size={14}
                    color={theme.colors.text.secondary}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.label}>Discord ID</Text>
                </View>
                <Text style={styles.value}>{userData.discordId}</Text>
              </View>
            )}
            {!!userData.discordJoinedAt && (
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <FontAwesome
                    name="calendar"
                    size={14}
                    color={theme.colors.text.secondary}
                    style={styles.labelIcon}
                  />
                  <Text style={styles.label}>Joined Discord</Text>
                </View>
                <Text style={styles.value}>
                  {formatDiscordDate(userData.discordJoinedAt)}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Social Links Section */}
      {hasSocialLinks && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome
              name="share-alt"
              size={18}
              color={theme.colors.primary[600]}
            />
            <Text style={styles.sectionTitle}>Social Links</Text>
          </View>
          <View style={styles.card}>
            <SocialLinks
              github_id={userData.github_id || ''}
              twitter_id={userData.twitter_id || ''}
              linkedin_id={userData.linkedin_id || ''}
            />
          </View>
        </View>
      )}

      {/* Account Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <FontAwesome
            name="clock-o"
            size={18}
            color={theme.colors.primary[600]}
          />
          <Text style={styles.sectionTitle}>Account Information</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <View style={styles.labelContainer}>
              <FontAwesome
                name="calendar-plus-o"
                size={14}
                color={theme.colors.text.secondary}
                style={styles.labelIcon}
              />
              <Text style={styles.label}>Member Since</Text>
            </View>
            <Text style={styles.value}>
              {formatTimestamp(userData.created_at)}
            </Text>
          </View>
          {!!userData.github_created_at && (
            <View style={styles.infoRow}>
              <View style={styles.labelContainer}>
                <FontAwesome
                  name="github"
                  size={14}
                  color={theme.colors.text.secondary}
                  style={styles.labelIcon}
                />
                <Text style={styles.label}>GitHub Account Created</Text>
              </View>
              <Text style={styles.value}>
                {formatTimestamp(userData.github_created_at)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text.primary,
  },
  card: {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadow.md,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    minHeight: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  labelIcon: {
    marginRight: theme.spacing.xs,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.secondary,
  },
  value: {
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: 'right',
    flexShrink: 1,
  },
  link: {
    color: theme.colors.primary[600],
    fontFamily: theme.typography.fontFamily.medium,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    ...theme.shadow.sm,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontFamily: theme.typography.fontFamily.medium,
    color: theme.colors.text.inverted,
    letterSpacing: 0.5,
  },
  warningBadge: {
    backgroundColor: theme.colors.warning[500],
  },
  warning: {
    color: theme.colors.warning[600],
  },
});

export default ExpandedUserInfo;
