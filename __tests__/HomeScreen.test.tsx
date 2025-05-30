import HomeScreen from "@/app/(tabs)/home/index";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

// Mocks for Zustand store and hooks
const mockFetchUserStatus = jest.fn();
const mockSubmitOOOForm = jest.fn();
const mockCancelOOO = jest.fn();

jest.mock("@/store/store", () => ({
  useUserStore: jest.fn(),
}));

jest.mock("@/hooks/getUserToken");

// Mock Alert to avoid actual alerts during testing
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Mock console.error to avoid cluttering test output
const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

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
    consoleSpy.mockClear();
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

  it("shows loading indicator if store is loading", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "ACTIVE" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: true,
    });
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

  it("handles error on OOO form submission", async () => {
    const error = new Error("Submit failed");
    mockSubmitOOOForm.mockRejectedValueOnce(error);
    const { getByText, getByTestId } = render(<HomeScreen />);
    
    fireEvent.press(getByText("Submit OOO"));
    fireEvent.press(getByTestId("mock-form-submit"));
    
    await waitFor(() => {
      expect(mockSubmitOOOForm).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Failed to update your status. Please try again."
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error submitting OOO form:",
        error
      );
    });
  });

  it("does not submit OOO form when token is null", async () => {
    (useCheckUserSession as unknown as jest.Mock).mockReturnValue({ token: null });
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "ACTIVE" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    
    const { getByText } = render(<HomeScreen />);
    // Since token is null, we should see loading screen
    expect(getByText("Loading...")).toBeTruthy();
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

  it("does not cancel OOO when token is null", async () => {
    (useCheckUserSession as unknown as jest.Mock).mockReturnValue({ token: null });
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "OOO" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    
    const { getByText } = render(<HomeScreen />);
    // Since token is null, we should see loading screen
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("shows loading indicator while cancelling OOO", async () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: { state: "OOO" } } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    
    // Mock cancelOOO to delay resolution so we can test loading state
    let resolveCancel: (value: boolean) => void;
    const cancelPromise = new Promise<boolean>((resolve) => {
      resolveCancel = resolve;
    });
    mockCancelOOO.mockReturnValueOnce(cancelPromise);
    
    const { getByText, UNSAFE_getByType } = render(<HomeScreen />);
    fireEvent.press(getByText("Cancel OOO"));
    
    // Should show loading indicator inside the button
    const activityIndicator = UNSAFE_getByType(require("react-native").ActivityIndicator);
    expect(activityIndicator).toBeTruthy();
    
    // Resolve the promise
    resolveCancel!(true);
    
    await waitFor(() => {
      expect(mockCancelOOO).toHaveBeenCalled();
    });
  });

  it("fetches user status when token becomes available", () => {
    const { rerender } = render(<HomeScreen />);
    expect(mockFetchUserStatus).toHaveBeenCalledWith("mock-token");
    
    // Clear the mock calls
    mockFetchUserStatus.mockClear();
    
    // Change token and rerender
    (useCheckUserSession as unknown as jest.Mock).mockReturnValue({ token: "new-token" });
    rerender(<HomeScreen />);
    
    expect(mockFetchUserStatus).toHaveBeenCalledWith("new-token");
  });

  it("displays UNKNOWN status when status is not available", () => {
    (useUserStore as unknown as jest.Mock).mockReturnValue({
      fetchUserStatus: mockFetchUserStatus,
      userStatus: { data: { currentStatus: null } },
      submitOOOForm: mockSubmitOOOForm,
      cancelOOO: mockCancelOOO,
      loading: false,
    });
    
    const { getByText } = render(<HomeScreen />);
    expect(getByText(/UNKNOWN/)).toBeTruthy();
  });
});

// Clean up mocks after all tests
afterAll(() => {
  consoleSpy.mockRestore();
  jest.restoreAllMocks();
});