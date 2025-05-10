import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import CustomModal from "../components/Modal/CustomModal";

describe("CustomModal", () => {
  const onClose = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when visible is false", () => {
    const { queryByTestId } = render(
      <CustomModal visible={false} onClose={onClose} onConfirm={onConfirm} />
    );
    expect(queryByTestId("custom-modal-container")).toBeNull();
  });

  it("renders modal content when visible is true", () => {
    const { getByTestId, getByText } = render(
      <CustomModal visible={true} onClose={onClose} onConfirm={onConfirm} />
    );
    expect(getByTestId("custom-modal-container")).toBeTruthy();
    expect(getByText(/Your QR code has been scanned successfully/i)).toBeTruthy();
    expect(getByText("Verify Status & Login")).toBeTruthy();
    expect(getByText("Close")).toBeTruthy();
  });

  it("calls onConfirm when 'Verify Status & Login' is pressed", () => {
    const { getByTestId } = render(
      <CustomModal visible={true} onClose={onClose} onConfirm={onConfirm} />
    );
    fireEvent.press(getByTestId("confirm-button"));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("calls onClose when 'Close' is pressed", () => {
    const { getByTestId } = render(
      <CustomModal visible={true} onClose={onClose} onConfirm={onConfirm} />
    );
    fireEvent.press(getByTestId("close-button"));
    expect(onClose).toHaveBeenCalled();
  });
});