import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";
import GithubLoginModal from "../components/Modal/GithubLoginModal";

// Mock FontAwesome and WebView
jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");
jest.mock("react-native-webview", () => "WebView");

describe("GithubLoginModal", () => {
  const onClose = jest.fn();
  const onNavigationStateChange = jest.fn();
  const animation = new Animated.Value(0);
  const url = "https://github.com/login";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when visible is false", () => {
    const { queryByTestId } = render(
      <GithubLoginModal
        visible={false}
        animation={animation}
        url={url}
        onClose={onClose}
        onNavigationStateChange={onNavigationStateChange}
      />
    );
    expect(queryByTestId("github-modal-container")).toBeNull();
  });

  it("renders modal and webview when visible is true", () => {
    const { getByTestId } = render(
      <GithubLoginModal
        visible={true}
        animation={animation}
        url={url}
        onClose={onClose}
        onNavigationStateChange={onNavigationStateChange}
      />
    );
    expect(getByTestId("github-modal-container")).toBeTruthy();
    expect(getByTestId("github-webview")).toBeTruthy();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByTestId } = render(
      <GithubLoginModal
        visible={true}
        animation={animation}
        url={url}
        onClose={onClose}
        onNavigationStateChange={onNavigationStateChange}
      />
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalled();
  });

  it("passes url and onNavigationStateChange to WebView", () => {
    const { getByTestId } = render(
      <GithubLoginModal
        visible={true}
        animation={animation}
        url={url}
        onClose={onClose}
        onNavigationStateChange={onNavigationStateChange}
      />
    );
    const webview = getByTestId("github-webview");
    expect(webview.props.source).toEqual({ uri: url });
    expect(webview.props.onNavigationStateChange).toBe(onNavigationStateChange);
  });
});
