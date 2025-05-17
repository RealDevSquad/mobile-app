import * as utils from "@/common/utils/common";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { reloadAppAsync } from "expo";
import { router } from "expo-router";
import React from "react";
import ProfileHeader from "../components/ProfileHeader";

// Mock dependencies
jest.mock("@/common/utils/common", () => ({
  removeLocalStorageItem: jest.fn(),
}));
jest.mock("expo-router", () => ({
  router: { navigate: jest.fn() },
}));
jest.mock("expo", () => ({
  reloadAppAsync: jest.fn(),
}));
jest.mock("expo-image", () => ({
  Image: (props: any) => {
    const React = require("react");
    const { View } = require("react-native");
    return React.createElement(View, {
      ...props,
      testID: props.testID || "expo-image",
    });
  },
}));

describe("ProfileHeader", () => {
  const baseProps = {
    first_name: "John",
    last_name: "Doe",
    username: "johndoe",
    designation: "Engineer",
    company: "RDS",
    github_id: "octocat",
    twitter_id: "twitteruser",
    linkedin_id: "linkedinuser",
    picture: { url: "https://example.com/avatar.jpg" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders avatar, user details, and social links", () => {
    const { getByText, getByTestId } = render(<ProfileHeader {...baseProps} />);
    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("@johndoe")).toBeTruthy();
    expect(getByText("Engineer")).toBeTruthy();
    expect(getByText("RDS")).toBeTruthy();
    expect(getByTestId("github-icon")).toBeTruthy();
    expect(getByTestId("twitter-icon")).toBeTruthy();
    expect(getByTestId("linkedin-icon")).toBeTruthy();
  });

  it("does not render avatar if picture.url is missing", () => {
    const { queryByTestId } = render(
      <ProfileHeader {...baseProps} picture={undefined} />
    );
    expect(queryByTestId("avatar-image")).toBeNull();
  });

  it("toggles menu visibility when menu button is pressed", () => {
    const { getByTestId, queryByText } = render(
      <ProfileHeader {...baseProps} />
    );
    const menuButton = getByTestId("menu-button");
    expect(queryByText("Logout")).toBeNull();
    fireEvent.press(menuButton);
    expect(queryByText("Logout")).toBeTruthy();
    fireEvent.press(menuButton);
    expect(queryByText("Logout")).toBeNull();
  });

  it("closes menu when pressing outside", () => {
    const { getByTestId, getByText, queryByText } = render(
      <ProfileHeader {...baseProps} />
    );
    const menuButton = getByTestId("menu-button");
    fireEvent.press(menuButton);
    expect(getByText("Logout")).toBeTruthy();
    fireEvent.press(getByTestId("menu-button"));
    expect(queryByText("Logout")).toBeNull();
  });

  it("calls logout logic when Logout is pressed", async () => {
    const { getByTestId, getByText } = render(<ProfileHeader {...baseProps} />);
    const menuButton = getByTestId("menu-button");
    fireEvent.press(menuButton);
    fireEvent.press(getByText("Logout"));
    await waitFor(() => {
      expect(utils.removeLocalStorageItem).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith("/");
      expect(reloadAppAsync).toHaveBeenCalled();
    });
  });

  it("closes menu when pressing backdrop", () => {
    const { getByTestId, getByText, queryByText } = render(
      <ProfileHeader {...baseProps} />
    );
    const menuButton = getByTestId("menu-button");
    fireEvent.press(menuButton);
    expect(getByText("Logout")).toBeTruthy();
    fireEvent.press(getByTestId("menu-backdrop"));
    expect(queryByText("Logout")).toBeNull();
  });

  it("does not change menu state when closeMenu is called while menu is already closed", () => {
    const { getByTestId, queryByText } = render(
      <ProfileHeader {...baseProps} />
    );
    fireEvent.press(getByTestId("menu-backdrop"));
    expect(queryByText("Logout")).toBeNull();
  });

  it("logs error if logout fails", async () => {
    const error = new Error("Logout failed");
    jest.spyOn(console, "error").mockImplementation(() => {});
    const removeLocalStorageItemMock = utils.removeLocalStorageItem;
    (removeLocalStorageItemMock as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });
    const { getByTestId, getByText } = render(<ProfileHeader {...baseProps} />);
    fireEvent.press(getByTestId("menu-button"));
    fireEvent.press(getByText("Logout"));
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith("Error logging out", error);
    });
    (console.error as jest.Mock).mockRestore();
  });
});
