import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import CameraModal from "../components/Modal/CameraModal";

// Mock expo-camera's CameraView
jest.mock("expo-camera", () => ({
  CameraView: ({ children, ...props }: any) => {
    const React = require("react");
    const { View } = require("react-native");
    return <View {...props}>{children}</View>;
  },
}));

jest.mock("@expo/vector-icons/FontAwesome", () => "FontAwesome");

describe("CameraModal", () => {
  const onBarcodeScanned = jest.fn();
  const onClose = jest.fn();
  const qrCodeLogin = jest.fn();

  const baseProps = {
    onBarcodeScanned,
    onClose,
    showModal: false,
    qrCodeLogin,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders instruction and scanner frame", () => {
    const { getByText } = render(<CameraModal {...baseProps} />);
    expect(getByText(/Please navigate to/i)).toBeTruthy();
    expect(getByText("https://my.realdevsquad.com/mobile")).toBeTruthy();
  });

  it("calls onBarcodeScanned when barcode is scanned", () => {
    const { getByTestId } = render(<CameraModal {...baseProps} />);
    const cameraView = getByTestId("camera-view");
    cameraView.props.onBarcodeScanned({ data: "scanned-data" });
    expect(onBarcodeScanned).toHaveBeenCalledWith("scanned-data");
  });

  it("does not call onBarcodeScanned if no data is provided", () => {
    const { getByTestId } = render(<CameraModal {...baseProps} />);
    const cameraView = getByTestId("camera-view");
    cameraView.props.onBarcodeScanned({});
    expect(onBarcodeScanned).not.toHaveBeenCalled();
  });

  it("calls onClose when close button is pressed", () => {
    const { getByTestId } = render(<CameraModal {...baseProps} />);
    const closeButton = getByTestId("close-button");
    fireEvent.press(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  it("shows modal and calls qrCodeLogin when Login is pressed", () => {
    const { getByTestId, getByText } = render(
      <CameraModal {...baseProps} showModal={true} />
    );
    expect(getByTestId("modal-container")).toBeTruthy();
    expect(
      getByText(/Your QR code has been scanned successfully/i)
    ).toBeTruthy();
    const loginButton = getByTestId("login-button");
    fireEvent.press(loginButton);
    expect(qrCodeLogin).toHaveBeenCalled();
  });

  it("does not render modal when showModal is false", () => {
    const { queryByTestId } = render(
      <CameraModal {...baseProps} showModal={false} />
    );
    expect(queryByTestId("modal-container")).toBeNull();
  });
});
