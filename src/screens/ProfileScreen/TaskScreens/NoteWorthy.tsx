import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { profileScreenStyles } from '../styles';
import {
  calculateTimeDifference,
  convertTimestampToReadableDate,
  fetchContribution,
} from '../../AuthScreen/Util';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';

type userContributionData = {
  task: {
    featureUrl: string;
    purpose: string;
    startedOn: string;
    endsOn: string;
    title: string;
  };
}[];

const Note = () => {
  const [userContributionData, setUserContributionData] =
    useState<userContributionData>([]);
  const { loggedInUserData } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const userName = loggedInUserData?.username;
        const contributionResponse = await fetchContribution(
          userName as string,
        );
        setUserContributionData(contributionResponse.noteworthy);
      })();
    }, [loggedInUserData?.username]),
  );

  return (
    <ScrollView style={styles.container}>
      {userContributionData ? (
        <View style={profileScreenStyles.container}>
          {userContributionData.map((item, index) => (
            <View style={profileScreenStyles.DropDownElement} key={index}>
              <TouchableOpacity
                style={profileScreenStyles.DropDownbackground}
                onPress={
                  item.task.featureUrl
                    ? () => Linking.openURL(item.task.featureUrl)
                    : () => {}
                }
              >
                <Text style={styles.taskTitle}>{item.task.title}</Text>
                <>
                  {item.task.purpose ? (
                    <Text style={styles.taskPurpose}>{item.task.purpose}</Text>
                  ) : (
                    <View style={styles.emptySpace} />
                  )}
                </>
                <Text style={styles.completionText}>
                  Estimated completion:{''}
                  <Text style={styles.completionBoldText}>
                    {calculateTimeDifference(
                      convertTimestampToReadableDate(item.task.startedOn),
                      convertTimestampToReadableDate(item.task.endsOn),
                    )}
                  </Text>
                </Text>
                <>
                  {item.task.featureUrl ? (
                    <Text style={styles.featureText}>
                      Checkout this feature in action
                    </Text>
                  ) : null}
                </>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.noTaskContainer}>
          <Text style={styles.noTaskText}>No noteworthy task yet!</Text>
        </View>
      )}
    </ScrollView>
  );
};

export default Note;

const styles = StyleSheet.create({
  scrollView: {
    padding: 10,
    elevation: 10,
  },
  container: {
    padding: 10,
  },
  taskContainer: {
    marginBottom: 15,
  },
  taskBackground: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  taskTitle: {
    color: 'blue',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskPurpose: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'grey',
    fontSize: 15,
  },
  completionText: {
    color: 'black',
    fontSize: 15,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  completionBoldText: {
    fontWeight: 'bold',
  },
  featureText: {
    color: 'grey',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 5,
  },
  emptySpace: {
    padding: 10,
  },
  noTaskContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  noTaskText: {
    fontSize: 13,
    color: 'black',
  },
});
