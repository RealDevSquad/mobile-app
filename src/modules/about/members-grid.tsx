import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { UsersApi } from "../../api/users/users.api";
import { MemberUser } from "../../api/users/user.dto";
import { getInitials } from "../../utils/common.utils";
import styles from "./members-grid.styles";

const MEMBERS_PER_ROW = 3;

function MemberCard({ member }: { member: MemberUser }) {
  const initials = getInitials(member.first_name, member.last_name, member.username);
  const fullName =
    [member.first_name, member.last_name].filter(Boolean).join(" ") || member.username;
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 60) / MEMBERS_PER_ROW;

  return (
    <View style={[styles.memberCard, { width: cardWidth }]}>
      <View style={styles.avatarContainer}>
        {member.picture?.url ? (
          <Image source={{ uri: member.picture.url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>{initials}</Text>
          </View>
        )}
      </View>
      <Text style={styles.memberName} numberOfLines={2}>
        {fullName}
      </Text>
      {member.designation && (
        <Text style={styles.memberOccupation} numberOfLines={1}>
          {member.designation}
        </Text>
      )}
      {member.github_id || member.linkedin_id || member.twitter_id ? (
        <View style={styles.socialIconsContainer}>
          {member.github_id ? (
            <FontAwesome5 name="github" size={12} color="#6B7280" style={styles.socialIcon} />
          ) : null}
          {member.linkedin_id ? (
            <FontAwesome5 name="linkedin" size={12} color="#6B7280" style={styles.socialIcon} />
          ) : null}
          {member.twitter_id ? (
            <FontAwesome5 name="twitter" size={12} color="#6B7280" style={styles.socialIcon} />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function MemberSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonAvatar} />
      <View style={styles.skeletonName} />
    </View>
  );
}

export function MembersGrid() {
  const { data, isLoading, error } = useQuery({
    queryKey: UsersApi.getMembers.key({ size: 100 }),
    queryFn: () =>
      UsersApi.getMembers.fn({
        size: 100,
      }),
  });

  const members = data?.users || [];

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.gridContainer}>
          {Array.from({ length: 9 }, (_, index) => (
            <MemberSkeleton key={`skeleton-member-${index}`} />
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 14, color: "#EF4444", textAlign: "center" }}>
          Failed to load members
        </Text>
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        <Text style={{ fontSize: 14, color: "#6B7280", textAlign: "center" }}>
          No members found
        </Text>
      </View>
    );
  }

  const rows: MemberUser[][] = [];
  for (let i = 0; i < members.length; i += MEMBERS_PER_ROW) {
    rows.push(members.slice(i, i + MEMBERS_PER_ROW));
  }

  return (
    <View style={styles.container}>
      <View style={styles.listContent}>
        {rows.map((row) => (
          <View key={row.map((m) => m.id).join("-")} style={styles.row}>
            {row.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
            {row.length < MEMBERS_PER_ROW &&
              Array.from({ length: MEMBERS_PER_ROW - row.length }, (_, idx) => (
                <View
                  key={`empty-${idx}`}
                  style={{
                    width: (Dimensions.get("window").width - 60) / MEMBERS_PER_ROW,
                  }}
                />
              ))}
          </View>
        ))}
      </View>
    </View>
  );
}
