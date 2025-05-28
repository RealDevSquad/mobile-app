import HomeScreen from "@/app/(tabs)/home/index";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";

// Mocks for Zustand store and hooks
const mockFetchUserStatus = jest.fn();
const mockSubmitOOOForm = jest.fn();
const mockCancelOOO = jest.fn();

jest.mock("@/store/store", () => ({
  useUserStore: jest.fn(),
}));

jest.mock("@/hooks/getUserToken");


jest.mock("@/components/StatusUpdateForm", () => {
  const React = require("react");
  const { TouchableOpacity, Text } = require("react-native");
  return {
    __esModule: true,
    default: ({
      onSubmit,
      onClose,
    }: {
      onSubmit: (fromDate: Date, toDate: Date, description: string) => void;
      onClose: () => void;
    }) => (
      <>
        <TouchableOpacity
          testID="mock-form-submit"
          onPress={() => onSubmit(new Date(), new Date(), "desc")}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity testID="mock-form-close" onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </>
    ),
  };
});

import useCheckUserSession from "@/hooks/getUserToken";
import { useUserStore } from "@/store/store";

describe("HomeScreen Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "ACTIVE" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    (useCheckUserSession as unknown as jest.Mock).mockReturnValue({ token: "mock-token" });
  });

  it("shows loading indicator if token or loading", () => {
    (useCheckUserSession as unknown as jest.Mock).mockReturnValue({ token: null });
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("shows current status and submit OOO button if ACTIVE", () => {
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/You are currently/i)).toBeTruthy();
    expect(getByText("Submit OOO")).toBeTruthy();
  });

  it("shows cancel OOO button if OOO", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "OOO" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Cancel OOO")).toBeTruthy();
  });

  it("opens and closes the OOO form", async () => {
    const { getByText, getByTestId, queryByTestId } = render(<HomeScreen />);
    fireEvent.press(getByText("Submit OOO"));
    expect(getByTestId("mock-form-submit")).toBeTruthy();
    fireEvent.press(getByTestId("mock-form-close"));
    await waitFor(() => {
      expect(queryByTestId("mock-form-submit")).toBeNull();
    });
  });

  it("submits OOO form and updates status", async () => {
    mockSubmitOOOForm.mockResolvedValueOnce(true);
    const { getByText, getByTestId } = render(<HomeScreen />);
    fireEvent.press(getByText("Submit OOO"));
    fireEvent.press(getByTestId("mock-form-submit"));
    await waitFor(() => {
      expect(mockSubmitOOOForm).toHaveBeenCalled();
      expect(mockFetchUserStatus).toHaveBeenCalled();
    });
  });

  it("cancels OOO and updates status", async () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "OOO" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    mockCancelOOO.mockResolvedValueOnce(true);
    const { getByText } = render(<HomeScreen />);
    fireEvent.press(getByText("Cancel OOO"));
    await waitFor(() => {
      expect(mockCancelOOO).toHaveBeenCalled();
      expect(mockFetchUserStatus).toHaveBeenCalled();
    });
  });

  it("handles error on OOO cancel", async () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "OOO" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    mockCancelOOO.mockRejectedValueOnce(new Error("Cancel failed"));
    const { getByText } = render(<HomeScreen />);
    fireEvent.press(getByText("Cancel OOO"));
    await waitFor(() => {
      expect(mockCancelOOO).toHaveBeenCalled();
    });
  });
});
