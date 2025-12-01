import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MembersGrid } from "./members-grid";
import styles from "./about.styles";
import { appConfig } from "../../config/app.config";

const RDS_DESCRIPTION =
  "Real Dev Squad is an online non-profit open source free fun community for people in tech, mainly developers, designers, college students, or product managers, to come, learn and contribute towards building a platform for our community, that helps upskill everyone.\n\nWe are an inclusive, respectful, warm, motivated and committed squad of people who constantly grow together and tackle bigger and harder challenges to ensure we become some of the best problem solvers, engineers, designers and more out there.";

const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/company/real-dev-squad",
  twitter: "https://x.com/realdevsquad",
  website: "https://www.realdevsquad.com",
  peerlist: "https://peerlist.io/company/realdevsquad",
  facebook: "https://www.facebook.com/Real-Dev-Squad-108713777585062/",
};

function SocialLinks() {
  const handlePress = (url: string) => {
    WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.socialLinksContainer}>
      <Pressable
        style={({ pressed }) => [styles.socialLink, pressed && { opacity: 0.7 }]}
        onPress={() => handlePress(SOCIAL_LINKS.linkedin)}
      >
        <FontAwesome5 name="linkedin" size={20} color="#0077B5" />
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.socialLink, pressed && { opacity: 0.7 }]}
        onPress={() => handlePress(SOCIAL_LINKS.twitter)}
      >
        <FontAwesome5 name="twitter" size={20} color="#1DA1F2" />
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.socialLink, pressed && { opacity: 0.7 }]}
        onPress={() => handlePress(SOCIAL_LINKS.website)}
      >
        <FontAwesome5 name="globe" size={20} color="#6B7280" />
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.socialLink, pressed && { opacity: 0.7 }]}
        onPress={() => handlePress(SOCIAL_LINKS.peerlist)}
      >
        <FontAwesome5 name="user-friends" size={20} color="#6B7280" />
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.socialLink, pressed && { opacity: 0.7 }]}
        onPress={() => handlePress(SOCIAL_LINKS.facebook)}
      >
        <FontAwesome5 name="facebook" size={20} color="#1877F2" />
      </Pressable>
    </View>
  );
}

export function AboutModule() {
  const insets = useSafeAreaInsets();
  const logoSource = require("../../../assets/images/rdsLogo.png");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Image source={logoSource} style={styles.logo} />
          </View>
          <Text style={styles.title}>{appConfig.appName}</Text>
          <SocialLinks />
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>{RDS_DESCRIPTION}</Text>
        </View>

        <View style={styles.membersSection}>
          <Text style={styles.membersSectionTitle}>Our Members</Text>
          <MembersGrid />
        </View>
      </ScrollView>
    </View>
  );
}
