// jest.setup.ts
import React from "react"; // Required for JSX
import { Alert as ReactNativeAlert, View } from "react-native";
import "react-native-gesture-handler/jestSetup"; // If you use gesture handler

// ---- Mock for @expo/vector-icons ----
interface IoniconsProps {
  name: string;
  size?: number;
  color?: string;
  testID?: string;
  [key: string]: any;
}

jest.mock("@expo/vector-icons", () => {
  const MockIonicons: React.FC<IoniconsProps> = (props) =>
    React.createElement(View, { ...props, testID: props.testID || "icon" });
  return {
    Ionicons: MockIonicons,
  };
});

// ---- Mock react-native-date-picker ----
interface MockDatePickerComponentProps {
  open: boolean;
  date: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  modal?: boolean;
  mode?: "date" | "datetime" | "time";
}

// Global state variables for the mock. These will hold the props of the
// most recently interacted-with/rendered DatePicker instance.
let mockDatePickerOpen = false;
let mockDatePickerDate: Date = new Date();
let mockDatePickerOnConfirm: (date: Date) => void = () => {};
let mockDatePickerOnCancel: () => void = () => {};

// This includes the component signature and the static helper methods.
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
// Spy on Alert.alert from react-native
jest.spyOn(ReactNativeAlert, "alert");
