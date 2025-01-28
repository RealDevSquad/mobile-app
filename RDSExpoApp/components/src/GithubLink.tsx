import React from 'react';
import { Linking, Text, TouchableOpacity } from 'react-native';
import { profileScreenStyles } from '../../app/screens/ProfileScreen/styles';

const GithubLink = ({ issueUrl }: { issueUrl: string }) => {
  if (!issueUrl) {
    return <Text>NA</Text>;
  }
  const match =
    issueUrl &&
    issueUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)\/issues\/(\d+)/);
  if (!match) {
    // Handle invalid URL or other cases
    return null;
  }
  const [, , repo, issueNumber] = match;

  const openGithubLink = () => {
    Linking.openURL(issueUrl);
  };

  return (
    <TouchableOpacity onPress={openGithubLink}>
      <Text style={profileScreenStyles.linkText}>
        {repo.toUpperCase()} #{issueNumber}
      </Text>
    </TouchableOpacity>
  );
};

export default GithubLink;
