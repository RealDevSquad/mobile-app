import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import ShortGoalsComponent from '../src/components/ShortGoalsComponent/ShortGoalsComponent';
import Card from '../src/components/ToDoComponent/Card';
import 'react-native-gesture-handler';
import DurationDropdown from '../src/components/CreateGoalForm/Dropdown';
import FloatingButton from '../src/components/FloatingButton';

// Short Term Goals component test

test.skip('flatlist does not exist on initial render', () => {
  const { queryByTestId, getByTestId } = render(<ShortGoalsComponent />);
  expect(queryByTestId('flatlist')).toBeNull();
  expect(getByTestId('arrowBtnIcon').props.style).toStrictEqual({
    resizeMode: 'cover',
    width: 30,
    height: 30,
  });
});

test.skip('flatlist exists when we click on the arrow button', () => {
  const { queryByTestId, getByTestId } = render(<ShortGoalsComponent />);
  fireEvent.press(getByTestId('arrowBtn'));
  expect(queryByTestId('flatlist')).toBeTruthy();
  expect(getByTestId('arrowBtnIcon').props.style).toStrictEqual({
    resizeMode: 'cover',
    width: 30,
    height: 30,
    transform: [{ rotate: '90deg' }],
  });
});

// Create Goal component test

test.skip('roadmap type does not exist on initial render', () => {
  const { queryByTestId } = render(<DurationDropdown />);
  expect(queryByTestId('longTermRoadmap')).toBeNull();
});

test.skip('roadmap type exists when use select duration as long term and stays undefined initally', () => {
  const { getByTestId } = render(<DurationDropdown />);
  fireEvent.press(getByTestId('roadmapType'));
  expect(getByTestId('roadmapType').props.value).toStrictEqual(undefined);
});

// Floating Button test

test.skip('floating actions exists when we click floating button', () => {
  const { queryByTestId, getByTestId } = render(<FloatingButton />);
  fireEvent.press(getByTestId('floatingButton'));
  expect(queryByTestId('floatingButton')).toBeTruthy();
  expect(getByTestId('floatingButton').props.style).toStrictEqual({
    marginTop: '120%',
  });
});

// ToDoComponent Tests

jest.mock('react-native-gesture-handler', () => {});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native').View;

  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
  };
});
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock'),
);
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;

  return {
    useSharedValue: jest.fn(),
    useAnimatedGestureHandler: jest.fn(),
    useAnimatedStyle: jest.fn(),
    View: View,
    Easing: {},
  };
});

const DATA = {
  title: 'Task1',
  assigned_by: 'admin',
};

test('setTimeout called which calls other two functions remove and changecard', () => {
  const { getByTestId } = render(
    <Card
      item={DATA}
      posStyle="relative"
      changecard={() => {}}
      removeCard={() => {}}
      disabled={false}
      setDisabled={() => {}}
    />,
  );

  jest.useFakeTimers();
  jest.spyOn(global, 'setTimeout');
  fireEvent.press(getByTestId('doneBtn'));
  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 4000);
});
