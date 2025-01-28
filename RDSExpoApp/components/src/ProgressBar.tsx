import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { overallTaskProgress } from '../../app/screens/AuthScreen/Util';
import { AuthContext } from '../context/AuthContext';

function ProgressBar({
  percCompleted,
  taskId,
  startedOn,
  endsOn,
}: {
  percCompleted: number;
  taskId: string;
  startedOn: string;
  endsOn: string;
}) {
  const [progressValue, setProgressValue] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const { loggedInUserData } = useContext(AuthContext);
  const [progressColor, setProgressColor] = useState('#3498db');
  useEffect(() => {
    setProgressValue(percCompleted);
  }, [percCompleted]);
  useEffect(() => {
    handleProgressColor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressValue]);
  function inputParser(input: string) {
    const parsedDate = moment(new Date(parseInt(input, 10) * 1000));
    return parsedDate;
  }
  function getPercentageOfDays(startedOn_: string, endsOn_: string) {
    const startDate = inputParser(startedOn_);
    const endDate = inputParser(endsOn_);
    const totalDays = endDate.diff(startDate, 'days');
    const daysLeft = endDate.diff(new Date(), 'days');
    const percentageofDays = (daysLeft / totalDays) * 100;
    return percentageofDays;
  }
  function handleProgressColor() {
    const percentageOfDaysLeft = getPercentageOfDays(startedOn, endsOn);
    const percentIncomplete = 100 - progressValue;

    if (progressValue === 100 || percentageOfDaysLeft >= percentIncomplete) {
      setProgressColor('green');
      return;
    }

    if (
      (percentageOfDaysLeft < 25 && percentIncomplete > 35) ||
      (percentageOfDaysLeft <= 0 && percentIncomplete > 0)
    ) {
      setProgressColor('orange');
      return;
    }

    if (percentageOfDaysLeft < 50 && percentIncomplete > 75) {
      setProgressColor('red');
      return;
    }
    setProgressColor('yellow');
  }

  const panResponder = useRef(
    //TODO: on decreasing it sets value to 0
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const newValue = Math.max(
          0,
          Math.min(progressValue + gestureState.dx, 100),
        );
        const roundedValue = Math.round(newValue / 10) * 10;
        setProgressValue(roundedValue);
        updateProgressValue(roundedValue);
        progress.setValue(roundedValue);
      },
    }),
  ).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: progressValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, progressValue]);

  const updateProgressValue = async (progressVal: number) => {
    try {
      let res = await overallTaskProgress(
        loggedInUserData?.token,
        progressVal,
        taskId,
      );
      Toast.show({
        type: 'success',
        text1: res.message,
        position: 'bottom',
      });
    } catch (error) {
      console.error('API error:', error);
      if (error?.message === 'Network Error') {
        Toast.show({
          type: 'error',
          text1: 'Task update failed',
          text2: 'Please check your network connection and try again.',
          position: 'bottom',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Task update failed',
          text2: 'An unexpected error occurred. Please try again later.',
          position: 'bottom',
        });
      }
    }
  };
  const handleIncrement = () => {
    const newValue = Math.min(progressValue + 10, 100);
    setProgressValue(newValue);
    updateProgressValue(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(progressValue - 10, 0);
    setProgressValue(newValue);
    updateProgressValue(newValue);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: progressValue ? progressValue + '%' : 0 + '%',
            backgroundColor: progressColor,
          },
        ]}
        {...panResponder.panHandlers}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleDecrement}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {progressValue ? Math.round(progressValue) : 0}%
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleIncrement}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: 80,
    backgroundColor: '#eee',
    borderRadius: 10,
    margin: 10,
    padding: 10,
  },
  bar: {
    height: '30%',
    backgroundColor: '#3498db',
    borderRadius: 10,
    alignItems: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2980b9',
    borderRadius: 5,
    // padding: 10,
    height: 30,
    width: 30,
    borderWidth: 1,
    borderColor: '#2980b9',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProgressBar;
