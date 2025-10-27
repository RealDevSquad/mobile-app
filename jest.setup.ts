import '@testing-library/jest-native/extend-expect';
import { Alert as ReactNativeAlert } from 'react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock(
  '@react-native-async-storage/async-storage',
  () =>
    import('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// ---- Mock for @expo/vector-icons ----
interface IoniconsProps {
  // Keep interface definition
  name: string;
  size?: number;
  color?: string;
  testID?: string;
  [key: string]: any;
}

jest.mock('@expo/vector-icons', () => {
  const React = import('react');
  const { View } = import('react-native');

  const MockIonicons: React.FC<IoniconsProps> = (props) =>
    React.createElement(View, { ...props, testID: props.testID || 'icon' });
  return {
    Ionicons: MockIonicons,
  };
});

// ---- Mock react-native-date-picker ----
interface MockDatePickerComponentProps {
  // Keep interface
  open: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  modal?: boolean;
  mode?: 'date' | 'datetime' | 'time';
}

let mockDatePickerOpen = false;
let mockDatePickerOnConfirm: (date: Date) => void = () => {};
let mockDatePickerOnCancel: () => void = () => {};

interface MockDatePickerModule extends React.FC<MockDatePickerComponentProps> {
  simulateConfirm: (date: Date) => void;
  simulateCancel: () => void;
}

jest.mock('react-native-date-picker', (): MockDatePickerModule => {
  const MockDatePickerComponent: MockDatePickerModule = (props) => {
    mockDatePickerOpen = props.open;
    mockDatePickerDate = props.date;
    mockDatePickerOnConfirm = props.onConfirm;
    mockDatePickerOnCancel = props.onCancel;

    if (props.open) {
      return null;
    }
    return null;
  };

  MockDatePickerComponent.simulateConfirm = (dateToConfirm: Date) => {
    if (mockDatePickerOpen && mockDatePickerOnConfirm) {
      mockDatePickerOnConfirm(dateToConfirm);
    }
  };

  MockDatePickerComponent.simulateCancel = () => {
    if (mockDatePickerOpen && mockDatePickerOnCancel) {
      mockDatePickerOnCancel();
    }
  };

  return MockDatePickerComponent;
});

// ---- Mock React Native Alert ----
jest.spyOn(ReactNativeAlert, 'alert');

// ---- Mock React Native Linking ----
export const mockLinkingOpenURL = jest.fn();
export const mockLinkingCanOpenURL = jest.fn(() => Promise.resolve(true));
export const mockLinkingGetInitialURL = jest.fn(() => Promise.resolve(null));
export const mockLinkingAddEventListener = jest.fn();
export const mockLinkingRemoveEventListener = jest.fn();
