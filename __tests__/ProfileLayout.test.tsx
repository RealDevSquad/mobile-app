import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import ProfileLayout from "../app/(tabs)/profile/_layout";

// Mock expo-router with proper Stack implementation
jest.mock("expo-router", () => {
  const React = require("react");
  const { View } = require("react-native");

  const Stack = ({ children }: { children: React.ReactNode }) => {
    return <View testID="stack-container">{children}</View>;
  };

  Stack.Screen = ({ name, options }: { name: string; options?: any }) => {
    if (name === "details" && options && options.headerLeft) {
      const headerLeft = options.headerLeft();
      return (
        <View testID={`screen-${name}`}>
          <View testID="header-container">{headerLeft}</View>
        </View>
      );
    }
    return <View testID={`screen-${name}`} />;
  };

  return {
    Stack,
    useRouter: () => ({
      back: jest.fn(),
    }),
  };
});

// Mock FontAwesome
jest.mock("@expo/vector-icons/FontAwesome5", () => ({
  __esModule: true,
  default: ({
    name,
    onPress,
    style,
    testID,
  }: {
    name: string;
    onPress: () => void;
    style?: any;
    testID?: string;
  }) => {
    const React = require("react");
    const { TouchableOpacity, Text } = require("react-native");
    return (
      <TouchableOpacity
        onPress={onPress}
        testID={testID || `icon-${name}`}
        style={style}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  },
}));

describe("ProfileLayout", () => {
  it("renders without crashing", () => {
    const { getByTestId } = render(<ProfileLayout />);
    expect(getByTestId("stack-container")).toBeTruthy();
    expect(getByTestId("screen-index")).toBeTruthy();
    expect(getByTestId("screen-details")).toBeTruthy();
  });

  it("renders the details screen with correct options", () => {
    const { getByTestId } = render(<ProfileLayout />);
    expect(getByTestId("screen-details")).toBeTruthy();
  });

  it("has a back button that navigates back when pressed", () => {
    const mockBack = jest.fn();

    require("expo-router").useRouter = () => ({
      back: mockBack,
    });

    const { getByTestId } = render(<ProfileLayout />);
    const backButton = getByTestId("icon-arrow-left");

    fireEvent.press(backButton);

    expect(mockBack).toHaveBeenCalled();
  });

  it("renders the header container", () => {
    const { getByTestId } = render(<ProfileLayout />);
    expect(getByTestId("header-container")).toBeTruthy();
  });
});
