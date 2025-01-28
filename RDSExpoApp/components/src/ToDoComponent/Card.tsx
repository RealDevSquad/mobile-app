import React, { memo, useEffect, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import Images from '../../../constants/images/Image';
import { CardStyles } from './Styles/CardStyles';

type items = {
  id: number;
  task: string;
  isread: boolean;
};

type props = {
  item: items;
  posStyle: any;
  changecard: (id: number) => void;
  removeCard: (id: number) => void;
  disabled: boolean;
  setDisabled: any;
  title?: string;
  assigned_by?: string;
  markDone?: () => void;
};

const Card = ({
  item,
  posStyle,
  changecard,
  removeCard,
  setDisabled,
  title,
  assigned_by,
}: props) => {
  let timerRef: any;

  const deleteTask = () => {
    timerRef = setTimeout(() => deleteCardFunction(), 4000);
  };

  const { width: SCREEN_WIDTH } = Dimensions.get('screen');
  const SCREEN_WIDTH_30 = SCREEN_WIDTH / 3;
  const ROTATION_DEG = 60;
  const CARD_MOVEMENT_THRESHOLD = SCREEN_WIDTH / 2;

  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => clearTimeout(timerRef);
  }, [timerRef]);

  const translateY = useSharedValue<number>(0);
  const translateX = useSharedValue<number>(0);

  const [checked, setChecked] = useState<boolean>(false);
  let deleteCard = 'false';

  const panGesture = useAnimatedGestureHandler({
    onActive: (event) => {
      if (translateY.value < CARD_MOVEMENT_THRESHOLD) {
        translateY.value = event.translationY;
      }
      if (translateX.value < CARD_MOVEMENT_THRESHOLD) {
        translateX.value = event.translationX;
      }
      if (translateY.value < -CARD_MOVEMENT_THRESHOLD) {
        translateY.value = event.translationY;
      }
      if (translateX.value < -CARD_MOVEMENT_THRESHOLD) {
        translateX.value = event.translationX;
      }
    },
    onEnd: () => {
      console.log('end');
      translateY.value = withTiming(0, { easing: Easing.linear });
      translateX.value = withTiming(0, { easing: Easing.linear });

      if (
        translateX.value > SCREEN_WIDTH_30 ||
        translateX.value < -SCREEN_WIDTH_30
      ) {
        translateX.value = withTiming(
          translateX.value > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH,
          { easing: Easing.linear },
          (finished) => {
            if (finished) {
              return runOnJS(removeCard)(item.id);
            }
          },
        );
      }

      if (translateY.value < -100 || translateY.value > 100) {
        // item.id required but after removing this the function is not getting called
        return runOnJS(changecard)(item.id);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: translateY.value,
      },
      {
        translateX: translateX.value,
      },
      {
        rotate: `${interpolate(
          translateX.value,
          [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
          [-ROTATION_DEG, 0, ROTATION_DEG],
        )} deg`,
      },
    ],
  }));

  const markDone = () => {
    deleteCard = 'true';
    setChecked(true);
    setDisabled(true);
    Toast.show({
      type: 'error',
      text1: 'Marked as done',
      text2: 'Click here to mark undone',
      position: 'bottom',
      bottomOffset: 80,
      onPress: () => {
        Toast.hide();
        deleteCard = 'false';
        setChecked(false);
        setDisabled(false);
      },
    });
    deleteTask();
  };

  const deleteCardFunction = () => {
    if (deleteCard === 'true') {
      removeCard(item.id);
    }
  };

  return (
    <View>
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={panGesture}>
          <Animated.View
            style={[CardStyles.card, animatedStyle, { position: posStyle }]}
          >
            <View style={{ justifyContent: 'center' }}>
              <View style={!item.isread ? { height: 25 } : null}>
                {/* {item.isread && (
                  <Image
                    source={Images.earthIcon}
                    style={[CardStyles.icon, { alignSelf: 'flex-end' }]}
                  />
                )} */}
              </View>
              <View style={CardStyles.flex}>
                <TouchableOpacity onPress={markDone} testID="doneBtn">
                  <Image
                    source={checked ? Images.checkedIcon : Images.uncheckedIcon}
                    style={[CardStyles.icon]}
                  />
                </TouchableOpacity>
                <Text style={CardStyles.taskText}>{title}</Text>
              </View>
              <View style={CardStyles.assignedTextContainer}>
                <Text style={{ fontWeight: 'bold' }}>Assigned By: </Text>
                {assigned_by === '' ? (
                  <Text style={{ color: 'gray' }}>Unknown</Text>
                ) : (
                  <Text style={{ color: 'grey' }}>{assigned_by}</Text>
                )}
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </View>
  );
};

export default memo(Card);
