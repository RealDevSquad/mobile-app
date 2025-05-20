import * as getUserTokenModule from "@/hooks/getUserToken";
import * as storeModule from "@/store/store";
import { useNetInfo } from "@react-native-community/netinfo";
import { render } from "@testing-library/react-native";
import React from "react";
import ProfileScreen from "../app/(tabs)/profile/index";

// Mock react-native-collapsible-tab-view
jest.mock("react-native-collapsible-tab-view", () => {
  const React = require("react");
  const { View, Text } = require("react-native");

  return {
    Tabs: {
      Container: ({
        renderHeader,
        children,
      }: {
        renderHeader?: () => React.ReactNode;
        children: React.ReactNode;
      }) => {
        const header = renderHeader ? renderHeader() : null;
        const tabs = React.Children.toArray(children);

        return (
          <View testID="tabs-container">
            {header}
            <View testID="active-tasks-tab">{tabs[0]}</View>
            <View testID="completed-tasks-tab">{tabs[1]}</View>
          </View>
        );
      },
      Tab: ({
        name,
        children,
      }: {
        name: string;
        children: React.ReactNode;
      }) => {
        return (
          <View testID={`tab-${name.replace(/\s+/g, "-").toLowerCase()}`}>
            <Text>{name}</Text>
            {children}
          </View>
        );
      },
      FlatList: ({
        data,
        renderItem,
        keyExtractor,
      }: {
        data: any[];
        renderItem: (info: { item: any; index: number }) => React.ReactNode;
        keyExtractor?: (item: any, index: number) => string;
      }) => {
        if (!data || data.length === 0) {
          return null;
        }

        return (
          <View testID={`flatlist-${data.length}`}>
            {data.map((item, index) => (
              <View
                key={keyExtractor ? keyExtractor(item, index) : index}
                testID={`item-${item.id}`}
              >
                {renderItem({ item, index })}
              </View>
            ))}
          </View>
        );
      },
    },
  };
});

// Mock dependencies
jest.mock("@/components/ProfileHeader", () => (props: any) => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return (
    <View testID="profile-header">
      <Text>
        {props.first_name}{" "}
        {props.last_name === undefined ? "undefined" : props.last_name}
      </Text>
    </View>
  );
});

jest.mock("@/components/Task", () => (props: any) => {
  const React = require("react");
  const { View, Text } = require("react-native");
  if (!props.tasks || props.tasks.length === 0) {
    return null;
  }
  return (
    <View>
      <Text>{props.tasks[0].title}</Text>
    </View>
  );
});

jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: jest.fn(),
}));
jest.mock("@/hooks/getUserToken", () => jest.fn());
jest.mock("@/store/store", () => ({
  useUserStore: jest.fn(),
}));

describe("ProfileScreen Integration", () => {
  const mockFetchUsers = jest.fn();
  const mockFetchActiveTask = jest.fn();

  const mockUserData = {
    first_name: "Jane",
    last_name: "Doe",
    username: "janedoe",
    designation: "Developer",
    company: "RDS",
    github_id: "octocat",
    twitter_id: "twitteruser",
    linkedin_id: "linkedinuser",
    picture: { url: "https://example.com/avatar.jpg" },
  };

  const mockTasks = [
    { id: "1", title: "Active Task", percentCompleted: 50 },
    { id: "2", title: "Completed Task", percentCompleted: 100 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (storeModule.useUserStore as unknown as jest.Mock).mockReturnValue({
      userData: mockUserData,
      loading: false,
      tasks: mockTasks,
      fetchUsers: mockFetchUsers,
      fetchActiveTask: mockFetchActiveTask,
    });
    (getUserTokenModule as any).default.mockReturnValue({
      token: "mock-token",
    });
    (useNetInfo as jest.Mock).mockReturnValue({
      type: "wifi",
      isConnected: true,
    });
  });

  it("renders loading state when token is missing", () => {
    (getUserTokenModule as any).default.mockReturnValue({ token: null });
    const { getByText } = render(<ProfileScreen />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders loading state when loading is true", () => {
    (storeModule.useUserStore as unknown as jest.Mock).mockReturnValue({
      userData: mockUserData,
      loading: true,
      tasks: [],
      fetchUsers: mockFetchUsers,
      fetchActiveTask: mockFetchActiveTask,
    });
    const { getByText } = render(<ProfileScreen />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders ProfileHeader with correct user data", () => {
    const { getByTestId, getByText } = render(<ProfileScreen />);
    expect(getByTestId("profile-header")).toBeTruthy();
    expect(getByText("Jane Doe")).toBeTruthy();
  });

  it("calls fetchUsers and fetchActiveTask when token is available", () => {
    render(<ProfileScreen />);
    expect(mockFetchUsers).toHaveBeenCalledWith("mock-token");
    expect(mockFetchActiveTask).toHaveBeenCalledWith("mock-token");
  });

  // This test is commented out as it's not relevant for the current implementation
  //   it("handles network disconnected state", () => {
  //     (useNetInfo as jest.Mock).mockReturnValue({
  //       type: "none",
  //       isConnected: false,
  //     });
  //     render(<ProfileScreen />);
  //     expect(true).toBe(true);
  //   });

  it("renders Completed Tasks tab with completed tasks", () => {
    const { getByText } = render(<ProfileScreen />);

    // this is for tab label
    expect(getByText("Completed Tasks")).toBeTruthy();

    // this is for task content
    expect(getByText("Completed Task")).toBeTruthy();
  });
});
