import { Alert as ReactNativeAlert } from "react-native";
import "react-native-gesture-handler/jestSetup";


// Mock for @react-native-async-storage/async-storage

const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => {
  const originalMock = require('@react-native-async-storage/async-storage/jest/async-storage-mock');

  return {
    ...originalMock,
    setItem: jest.fn((key: string, value: string) => {
      mockStorage[key] = value;
      return Promise.resolve();
    }),
    getItem: jest.fn((key: string) => {
      return Promise.resolve(mockStorage[key] ?? null);
    }),
    removeItem: jest.fn((key: string) => {
      delete mockStorage[key];
      return Promise.resolve();
    }),
    clear: jest.fn(() => {
      Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      return Promise.resolve();
    }),
  };
});




// ---- Mock for @expo/vector-icons ----
interface IoniconsProps {
  // Keep interface definition
  name: string;
  size?: number;
  color?: string;
  testID?: string;
  [key: string]: any;
}

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { View } = require("react-native");

  const MockIonicons: React.FC<IoniconsProps> = (props) =>
    React.createElement(View, { ...props, testID: props.testID || "icon" });
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
  mode?: "date" | "datetime" | "time";
}

let mockDatePickerOpen = false;
let mockDatePickerOnConfirm: (date: Date) => void = () => {};
let mockDatePickerOnCancel: () => void = () => {};

interface MockDatePickerModule extends React.FC<MockDatePickerComponentProps> {
  simulateConfirm: (date: Date) => void;
  simulateCancel: () => void;
}

jest.mock("react-native-date-picker", (): MockDatePickerModule => {
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
jest.spyOn(ReactNativeAlert, "alert");

// ---- Mock React Native Linking ----
export const mockLinkingOpenURL = jest.fn();
export const mockLinkingCanOpenURL = jest.fn(() => Promise.resolve(true));
export const mockLinkingGetInitialURL = jest.fn(() => Promise.resolve(null));
export const mockLinkingAddEventListener = jest.fn();
export const mockLinkingRemoveEventListener = jest.fn();
