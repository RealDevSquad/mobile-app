import * as commonUtils from "@/common/utils/common";
import { render } from "@testing-library/react-native";
import React from "react";
import TaskDetails from "../app/(tabs)/profile/details";

// Mock expo-router's useLocalSearchParams
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(),
}));

// Mock formatDateTime function
jest.mock("@/common/utils/common", () => ({
  formatDateTime: jest.fn(),
}));

describe("TaskDetails Component", () => {
  const mockParams = {
    id: "123",
    title: "Test Task",
    createdBy: "John Doe",
    assignee: "Jane Smith",
    endsOn: "1672531200000", // 2023-01-01
    startedOn: "1672444800000", // 2022-12-31
    status: "In Progress",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    require("expo-router").useLocalSearchParams.mockReturnValue(mockParams);
    (commonUtils.formatDateTime as jest.Mock).mockImplementation(
      (timestamp) => {
        return timestamp === 1672444800000 ? "Dec 31, 2022" : "Jan 1, 2023";
      }
    );
  });

  it("renders task title and status correctly", () => {
    const { getByText } = render(<TaskDetails />);
    expect(getByText("Test Task")).toBeTruthy();
    expect(getByText("In Progress")).toBeTruthy();
  });

  it("renders task details correctly", () => {
    const { getByText } = render(<TaskDetails />);
    expect(getByText("ID:")).toBeTruthy();
    expect(getByText("123")).toBeTruthy();
    expect(getByText("Created By:")).toBeTruthy();
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("Assignee:")).toBeTruthy();
    expect(getByText("Jane Smith")).toBeTruthy();
  });

  it("renders task dates correctly", () => {
    const { getByText } = render(<TaskDetails />);
    expect(getByText("Started On:")).toBeTruthy();
    expect(getByText("Dec 31, 2022")).toBeTruthy();
    expect(getByText("Ends On:")).toBeTruthy();
    expect(getByText("Jan 1, 2023")).toBeTruthy();

    expect(commonUtils.formatDateTime).toHaveBeenCalledWith(1672444800000);
    expect(commonUtils.formatDateTime).toHaveBeenCalledWith(1672531200000);
  });

  it("renders note section correctly", () => {
    const { getByText } = render(<TaskDetails />);
    expect(getByText("Note")).toBeTruthy();
    expect(
      getByText("To update progress, please log in to the website.")
    ).toBeTruthy();
  });

  it("handles missing title with fallback text", () => {
    require("expo-router").useLocalSearchParams.mockReturnValue({
      ...mockParams,
      title: undefined,
    });
    const { getByText } = render(<TaskDetails />);
    expect(getByText("Title is unavailable")).toBeTruthy();
  });

  it("handles missing createdBy with fallback text", () => {
    require("expo-router").useLocalSearchParams.mockReturnValue({
      ...mockParams,
      createdBy: undefined,
    });
    const { getByText } = render(<TaskDetails />);
    expect(getByText("Unknown")).toBeTruthy();
  });
});
