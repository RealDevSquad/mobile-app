import AuthScreen from "@/app/(tabs)";
import * as commonUtils from "@/common/utils/common";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { Camera } from "expo-camera";
import React from "react";
import { Alert } from "react-native";
import { Toast } from "toastify-react-native";

const mockRouterReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockRouterReplace }),
}));

const mockSetLocalStorageItem = jest.spyOn(commonUtils, "setLocalStorageItem");

jest.mock("@/components/Modal/CameraModal", () => (props: any) => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  return (
    <View testID="camera-modal">
      <Text>Camera Modal</Text>
      <TouchableOpacity
        testID="camera-modal-close-button"
        onPress={props.onClose}
      />
      <TouchableOpacity
        testID="simulate-barcode-scan"
        onPress={() => {
          if (props.onBarcodeScanned) {
            props.onBarcodeScanned("scanned-user-id");
          }
        }}
      />
      {props.showModal && (
        <View testID="confirmation-modal-in-camera">
          <Text>Your QR code has been scanned successfully</Text>
          <TouchableOpacity
            testID="confirmation-login-button"
            onPress={props.qrCodeLogin}
          />
        </View>
      )}
    </View>
  );
});

jest.mock("@/components/Modal/GithubLoginModal", () => (props: any) => {
  const React = require("react");
  const { View, Text, TouchableOpacity } = require("react-native");
  if (!props.visible) return null;
  return (
    <View testID="github-modal-container">
      <Text>Github Modal</Text>
      <TouchableOpacity
        testID="github-modal-close-button"
        onPress={props.onClose}
      />
      <TouchableOpacity
        testID="simulate-github-nav-change"
        onPress={(eventData: { url: string }) => {
          const urlToUse =
            eventData?.url || "rdsapp://auth?token=fake-github-token";
          props.onNavigationStateChange({
            url: urlToUse,
          });
        }}
      />
    </View>
  );
});

let mockStoredToken: string | null = null;
jest.mock("@/hooks/getUserToken", () => () => ({ token: mockStoredToken }));

jest.mock("expo-device", () => ({
  __esModule: true,
  osBuildId: "test-device-id",
  modelName: "TestModel",
}));

const mockRequestCameraPermissionsAsync = jest.fn();
Camera.requestCameraPermissionsAsync = mockRequestCameraPermissionsAsync;

const mockToastShow = jest.fn();
Toast.show = mockToastShow;

global.fetch = jest.fn();

const ACTUAL_TOKEN_KEY_USED_BY_COMPONENT = "github_token";

describe("AuthScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoredToken = null;
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { token: "fake-qr-token" },
        message: "Success",
      }),
    });
    mockRequestCameraPermissionsAsync.mockResolvedValue({ status: "granted" });
  });

  it("renders initial UI elements correctly", () => {
    const { getByText } = render(<AuthScreen />);
    expect(getByText("Welcome to")).toBeTruthy();
    expect(getByText("REAL DEV SQUAD")).toBeTruthy();
    expect(getByText("GitHub Login")).toBeTruthy();
    expect(getByText("Web Login ")).toBeTruthy();
  });

  it("redirects if token exists on mount", async () => {
    mockStoredToken = "existing-token";
    render(<AuthScreen />);
    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/home");
    });
  });

  describe("GitHub Login", () => {
    const renderAuthScreenForGitHub = async () => {
      const utils = render(<AuthScreen />);
      await waitFor(() =>
        expect(mockRequestCameraPermissionsAsync).toHaveBeenCalled()
      );
      return utils;
    };

    it("shows GithubLoginModal when GitHub Login button is pressed", async () => {
      const { getByText, getByTestId } = await renderAuthScreenForGitHub();
      act(() => {
        fireEvent.press(getByText("GitHub Login"));
      });
      await waitFor(() =>
        expect(getByTestId("github-modal-container")).toBeTruthy()
      );
    });

    it("closes GithubLoginModal when its close button is pressed", async () => {
      const { getByText, getByTestId, queryByTestId } =
        await renderAuthScreenForGitHub();
      act(() => {
        fireEvent.press(getByText("GitHub Login"));
      });
      await waitFor(() =>
        expect(getByTestId("github-modal-container")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("github-modal-close-button"));
      });
      await waitFor(() =>
        expect(queryByTestId("github-modal-container")).toBeNull()
      );
    });

    it("handles GitHub token from navigation change, stores token, and redirects", async () => {
      const { getByText, getByTestId } = await renderAuthScreenForGitHub();
      act(() => {
        fireEvent.press(getByText("GitHub Login"));
      });
      await waitFor(() =>
        expect(getByTestId("github-modal-container")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("simulate-github-nav-change"));
      });
      await waitFor(() => {
        expect(mockSetLocalStorageItem).toHaveBeenCalledWith(
          ACTUAL_TOKEN_KEY_USED_BY_COMPONENT,
          "fake-github-token"
        );
        expect(mockRouterReplace).toHaveBeenCalledWith("/home");
      });
    });

    it("handles and logs error if URL parsing throws inside handleNavigationStateChange", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const { getByText, getByTestId } = await renderAuthScreenForGitHub();

      const originalURL = global.URL;
      const mockUrlThatWillThrow = "rdsapp://auth?token=trigger-mocked-error";
      global.URL = jest.fn((urlInput) => {
        if (urlInput === mockUrlThatWillThrow) {
          throw new TypeError("Mocked URL parsing error");
        }
        return new originalURL(urlInput);
      }) as any;

      act(() => {
        fireEvent.press(getByText("GitHub Login"));
      });
      await waitFor(() =>
        expect(getByTestId("github-modal-container")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("simulate-github-nav-change"), {
          url: mockUrlThatWillThrow,
        });
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Error parsing URL:",
          expect.objectContaining({ message: "Mocked URL parsing error" })
        );
      });

      expect(mockSetLocalStorageItem).not.toHaveBeenCalled();
      expect(mockRouterReplace).not.toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
      global.URL = originalURL;
    });

    it("does nothing if token is missing or empty in navigation state change", async () => {
      const { getByText, getByTestId } = await renderAuthScreenForGitHub();
      act(() => {
        fireEvent.press(getByText("GitHub Login"));
      });
      await waitFor(() =>
        expect(getByTestId("github-modal-container")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("simulate-github-nav-change"), {
          url: "rdsapp://auth?token=",
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(mockSetLocalStorageItem).not.toHaveBeenCalled();
      expect(mockRouterReplace).not.toHaveBeenCalled();
    });

    it("does nothing if URL includes 'token=' but token value is not found", async () => {
      const { getByText, getByTestId } = await renderAuthScreenForGitHub();
      act(() => {
        fireEvent.press(getByText("GitHub Login"));
      });
      await waitFor(() =>
        expect(getByTestId("github-modal-container")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("simulate-github-nav-change"), {
          url: "rdsapp://auth?someparam=value&token=",
        });
      });

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(mockSetLocalStorageItem).not.toHaveBeenCalled();
      expect(mockRouterReplace).not.toHaveBeenCalled();
    });
  });

  describe("Web Login (QR Code)", () => {
    const renderAndWaitForCameraPermission = async () => {
      const utils = render(<AuthScreen />);
      await waitFor(() =>
        expect(mockRequestCameraPermissionsAsync).toHaveBeenCalled()
      );
      return utils;
    };

    it("requests camera permission and shows CameraModal when Web Login is pressed", async () => {
      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();

      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());
    });

    it("shows permission message if camera permission is denied", async () => {
      mockRequestCameraPermissionsAsync.mockResolvedValue({ status: "denied" });
      const { getByText, queryByTestId } =
        await renderAndWaitForCameraPermission();

      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => {
        expect(
          getByText("Camera permission is required to scan QR codes.")
        ).toBeTruthy();
        expect(queryByTestId("camera-modal")).toBeNull();
      });
    });

    it("closes CameraModal when its close button is pressed", async () => {
      const { getByText, getByTestId, queryByTestId } =
        await renderAndWaitForCameraPermission();

      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());

      act(() => {
        fireEvent.press(getByTestId("camera-modal-close-button"));
      });
      await waitFor(() => expect(queryByTestId("camera-modal")).toBeNull());
    });

    it("calls getAuthStatus when barcode is scanned in CameraModal", async () => {
      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();

      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());

      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining(
            "https://api.realdevsquad.com/auth/qr-code-auth?device_id=test-device-id"
          ),
          expect.objectContaining({ method: "POST" })
        );
      });
    });

    it("shows Alert on successful getAuthStatus and then shows confirmation modal", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Please confirm on your device" }),
      });
      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();

      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());

      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Please Confirm",
          "Please confirm on your device",
          expect.any(Array)
        );
      });

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const okButton = alertArgs[2].find((b: any) => b.text === "OK");
      act(() => {
        okButton.onPress();
      });
      await waitFor(() => {
        expect(getByTestId("confirmation-modal-in-camera")).toBeTruthy();
      });
    });

    it("calls qrCodeLogin, stores token, and redirects on successful confirmation", async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: "Please confirm on your device" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: { token: "fake-qr-token" } }),
        });

      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();

      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());

      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });
      await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const okButton = alertArgs[2].find((b: any) => b.text === "OK");
      act(() => {
        okButton.onPress();
      });
      await waitFor(() =>
        expect(getByTestId("confirmation-modal-in-camera")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("confirmation-login-button"));
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledTimes(2);
        expect((fetch as jest.Mock).mock.calls[1][0]).toEqual(
          expect.stringContaining(
            "https://api.realdevsquad.com/auth/qr-code-auth?device_id=test-device-id"
          )
        );
        expect((fetch as jest.Mock).mock.calls[1][1]).toBeUndefined();

        expect(mockSetLocalStorageItem).toHaveBeenCalledWith(
          ACTUAL_TOKEN_KEY_USED_BY_COMPONENT,
          "fake-qr-token"
        );
        expect(mockRouterReplace).toHaveBeenCalledWith("/home");
      });
    });

    it("shows toast message if qrCodeLogin fails to get a token", async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: "Please confirm" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ data: {} }),
        });

      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();
      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());
      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });
      await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const okButton = alertArgs[2].find((b: any) => b.text === "OK");
      act(() => {
        okButton.onPress();
      });
      await waitFor(() =>
        expect(getByTestId("confirmation-modal-in-camera")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("confirmation-login-button"));
      });

      await waitFor(() => {
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "error",
            text1: "Please authorize from my-site by giving confirmations",
          })
        );
      });
    });

    it("shows toast on getAuthStatus API failure", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Auth failed" }),
      });
      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();

      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());
      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });

      await waitFor(() => {
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "error",
            text1: "Something went wrong, please try again",
          })
        );
      });
    });

    it("shows toast on qrCodeLogin API failure", async () => {
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: "Please confirm" }),
        })
        .mockRejectedValueOnce(new Error("Network error"));

      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();
      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());
      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });
      await waitFor(() => expect(Alert.alert).toHaveBeenCalled());

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const okButton = alertArgs[2].find((b: any) => b.text === "OK");
      act(() => {
        okButton.onPress();
      });
      await waitFor(() =>
        expect(getByTestId("confirmation-modal-in-camera")).toBeTruthy()
      );

      act(() => {
        fireEvent.press(getByTestId("confirmation-login-button"));
      });

      await waitFor(() => {
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "error",
            text1: "Something went wrong, please try again later",
          })
        );
      });
    });

    it("shows generic toast message if getAuthStatus API fails with non-Error object", async () => {
      (fetch as jest.Mock).mockRejectedValueOnce("just a string error");

      const { getByText, getByTestId } =
        await renderAndWaitForCameraPermission();
      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());

      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });

      await waitFor(() => {
        expect(mockToastShow).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "error",
            text1: "Something went wrong, please try again",
          })
        );
      });
      consoleErrorSpy.mockRestore();
    });

    it("hides camera and resets scannedId when 'Cancel' is pressed on getAuthStatus alert", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Please confirm on your device" }),
      });

      const { getByText, getByTestId, queryByTestId } =
        await renderAndWaitForCameraPermission();
      act(() => {
        fireEvent.press(getByText("Web Login "));
      });
      await waitFor(() => expect(getByTestId("camera-modal")).toBeTruthy());

      act(() => {
        fireEvent.press(getByTestId("simulate-barcode-scan"));
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Please Confirm",
          "Please confirm on your device",
          expect.any(Array)
        );
      });

      const alertArgs = (Alert.alert as jest.Mock).mock.calls[0];
      const cancelButton = alertArgs[2].find(
        (button: any) => button.text === "Cancel"
      );

      expect(cancelButton).toBeDefined();
      await act(async () => {
        cancelButton.onPress();
      });
      await waitFor(() => {
        expect(queryByTestId("camera-modal")).toBeNull();
      });
    });
  });
});
