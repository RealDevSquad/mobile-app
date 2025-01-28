import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {
  calculateISODateFormat,
  fetchTaskDetails,
  fetchTaskProgressDetails,
  unixToTimeStamp,
} from '../../AuthScreen/Util';
import { profileScreenStyles } from '../styles';

import { useSelector } from 'react-redux';
import BackSvg from '../../../../assets/svgs/back';
import { AuthContext } from '../../../../components/context/AuthContext';
import Skelton from '../../../../components/Skelton';
import GithubLink from '../../../../components/src/GithubLink';
import ProgressBar from '../../../../components/src/ProgressBar';
import PushUpModalContent from '../../../../components/src/PushUpModalContent';

const TaskDetailScreen = () => {
  const route = useRoute();

  const { title, taskId, isActive } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progress, setProgress] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { isProdEnvironment } = useSelector((store) => store.localFeatureFlag);

  const toggleModal = (item) => {
    console.log(item);
    setIsModalVisible((prev) => !prev);

    setProgress(item);
  };

  const [allTaskDetail, setAllTaskDetailData] = useState();
  const navigation = useNavigation();

  const [allTaskProgressDetail, setAllTaskProgressDetailData] = useState();

  const { loggedInUserData } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const taskDetailPromise = fetchTaskDetails(
          taskId,
          loggedInUserData?.token,
        );
        const taskProgressPromise = fetchTaskProgressDetails(
          loggedInUserData?.token,
          taskId,
        );
        const [taskDetailResponse, taskProgressDetailResponse] =
          await Promise.all([taskDetailPromise, taskProgressPromise]);

        setAllTaskDetailData(taskDetailResponse);

        setAllTaskProgressDetailData(taskProgressDetailResponse);
        setIsLoading(false);
      })();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId]),
  );

  const backAction = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={profileScreenStyles.mainContainer}>
      <TouchableOpacity onPress={backAction}>
        <BackSvg width={30} height={30} />
      </TouchableOpacity>
      <Skelton isLoading={isLoading}>
        <>
          <Text style={profileScreenStyles.titleText}>
            {title ?? 'Title is unavailable'}
          </Text>
          {isActive && (
            <View style={profileScreenStyles.card}>
              <Text style={profileScreenStyles.subTitle}>Overall Progress</Text>
              <ProgressBar
                percCompleted={allTaskDetail?.taskData?.percentCompleted}
                taskId={taskId}
                startedOn={allTaskDetail?.taskData?.startedOn}
                endsOn={allTaskDetail?.taskData?.endsOn}
              />
            </View>
          )}

          <View style={profileScreenStyles.card}>
            <Text style={profileScreenStyles.subTitle}>Description</Text>
            <Text style={profileScreenStyles.descriptionText}>
              {allTaskDetail?.taskData.description ??
                'No description available'}
            </Text>
          </View>
          <View style={profileScreenStyles.card}>
            <Text style={profileScreenStyles.subTitle}>Details</Text>

            <View style={profileScreenStyles.flexContainer}>
              <View style={profileScreenStyles.flexItemWidth}>
                <Text style={profileScreenStyles.subTitleTypeText}>Type</Text>
                <Text style={profileScreenStyles.smallTitle}>
                  {allTaskDetail?.taskData.type.toUpperCase()}
                </Text>
              </View>

              <View style={profileScreenStyles.flexItemWidth}>
                <Text style={profileScreenStyles.subTitleTypeText}>
                  Priority
                </Text>
                <Text style={profileScreenStyles.smallTitle}>
                  {allTaskDetail?.taskData.priority.toUpperCase()}
                </Text>
              </View>

              <View style={profileScreenStyles.flexItemWidth}>
                <Text style={profileScreenStyles.subTitleTypeText}>Status</Text>
                <Text style={profileScreenStyles.smallTitle}>
                  {allTaskDetail?.taskData.status}
                </Text>
              </View>

              <View style={profileScreenStyles.flexItemWidth}>
                <Text style={profileScreenStyles.subTitleTypeText}>Link</Text>
                <GithubLink
                  issueUrl={allTaskDetail?.taskData.github?.issue?.html_url}
                />
              </View>
            </View>
          </View>
          <View style={profileScreenStyles.card}>
            <Text style={profileScreenStyles.subTitleText}>
              Progress Updates
            </Text>

            {allTaskProgressDetail?.data ? (
              allTaskProgressDetail?.data.map((item, index) => (
                <TouchableOpacity key={index} onPress={() => toggleModal(item)}>
                  <Text
                    style={[
                      profileScreenStyles.progressListLeftPadding,
                      profileScreenStyles.progressStyle,
                    ]}
                  >
                    {`\u25A1 ${calculateISODateFormat(item?.date)}`}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={profileScreenStyles.progressListLeftPadding}>
                {allTaskProgressDetail?.message}
              </Text>
            )}
          </View>
          <View style={profileScreenStyles.card}>
            <Text style={profileScreenStyles.subTitleText}>
              Task Dependencies
            </Text>
            <Text style={profileScreenStyles.descriptionText}>
              {/* TODO:handle array, wont execute as this wont be coming from the api */}
              {!allTaskDetail?.taskData?.dependsOn && 'No Dependency'}
            </Text>
          </View>
          <View style={profileScreenStyles.card}>
            <Text style={profileScreenStyles.subTitleText}>Participants</Text>
            <Text style={profileScreenStyles.subTitleTypeText}>Assignee</Text>
            <Text style={profileScreenStyles.smallTitle}>
              {allTaskDetail?.taskData?.assignee.toUpperCase()}
            </Text>
            <Text style={profileScreenStyles.subTitleTypeText}>Reporter</Text>
            {/* TODO:check through assignee Id, gave constant to maintain consistency as web */}
            <Text style={profileScreenStyles.smallTitle}>ANKUSH</Text>
          </View>
          <View style={profileScreenStyles.card}>
            <Text style={profileScreenStyles.subTitleText}>Dates</Text>
            <Text style={profileScreenStyles.subTitleTypeText}>Started On</Text>
            <Text style={profileScreenStyles.smallTitle}>
              {unixToTimeStamp(allTaskDetail?.taskData?.startedOn)}
            </Text>
            <Text style={profileScreenStyles.subTitleTypeText}>Ends On</Text>
            <Text style={profileScreenStyles.smallTitle}>
              {unixToTimeStamp(allTaskDetail?.taskData?.endsOn)}
            </Text>
          </View>
          {!isProdEnvironment ? (
            <View style={profileScreenStyles.card}>
              <Text style={profileScreenStyles.subTitleText}>
                Update Progress
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProgressDetail', {
                    taskId: taskId,
                  });
                }}
                style={profileScreenStyles.updateButtonContainer}
              >
                <Text style={profileScreenStyles.updatebutton}>
                  Update Progress
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {isModalVisible && (
            <Modal
              isVisible={isModalVisible}
              onBackdropPress={toggleModal}
              onBackButtonPress={toggleModal}
              backdropOpacity={0.7}
              animationIn="slideInUp"
              animationOut="slideOutDown"
              style={profileScreenStyles.modal}
            >
              <PushUpModalContent task={progress} />
            </Modal>
          )}
        </>
      </Skelton>
    </ScrollView>
  );
};

export default TaskDetailScreen;
