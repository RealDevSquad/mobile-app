import GithubSvg from "@/assets/svgs/github_logo";
import LinkedInSvg from "@/assets/svgs/linkedIn";
import TwitterSvg from "@/assets/svgs/twitter";
import { theme } from "@/constants/theme";
import React from "react";
import { Linking, Pressable, StyleSheet, View } from "react-native";

interface SocialLinksProps {
  github_id: string;
  twitter_id: string;
  linkedin_id: string;
}

const SocialLinks = ({
  github_id,
  twitter_id,
  linkedin_id,
}: SocialLinksProps) => {
  return (
    <View style={styles.container}>
      {twitter_id && (
        <Pressable
          testID="twitter-icon"
          onPress={() => Linking.openURL(`https://twitter.com/${twitter_id}`)}
        >
          <TwitterSvg height={30} width={30} />
        </Pressable>
      )}
      {linkedin_id && (
        <Pressable
          testID="linkedin-icon"
          onPress={() =>
            Linking.openURL(`https://www.linkedin.com/in/${linkedin_id}`)
          }
        >
          <LinkedInSvg height={30} width={30} />
        </Pressable>
      )}
      {github_id && (
        <Pressable
          testID="github-icon"
          onPress={() => Linking.openURL(`https://github.com/${github_id}`)}
        >
          <GithubSvg height={28} width={28} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: theme.spacing.lg,
  },
});

export default SocialLinks;
