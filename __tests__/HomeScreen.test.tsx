import HomeScreen from "@/app/(tabs)/home/index";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

const mockOnConfirm = jest.fn();
jest.mock("react-native-date-picker", () => {
  const MockDatePicker = (props: any) => {
    if (props.open) {
      mockOnConfirm.mockImplementation(props.onConfirm);
    }
    return null;
  };
  return MockDatePicker;
});

let mockToken: string | null = null;
let mockLoading = false;
let mockUserStatus: any = {};

const mockFetchUserStatus = jest.fn();
const mockSubmitOOOForm = jest.fn();
const mockCancelOOO = jest.fn();

jest.mock("@/hooks/getUserToken", () => ({
  __esModule: true,
  default: () => ({ token: mockToken }),
}));

jest.mock("@/store/store", () => ({
  useUserStore: () => ({
    loading: mockLoading,
    userStatus: mockUserStatus,
    fetchUserStatus: mockFetchUserStatus,
    submitOOOForm: mockSubmitOOOForm,
    cancelOOO: mockCancelOOO,
  }),
}));

jest.spyOn(Alert, "alert");

describe("HomeScreen Integration Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockOnConfirm.mockClear();

    mockToken = "mock-token";
    mockLoading = false;
    mockUserStatus = { data: { currentStatus: { state: "ACTIVE" } } };

    mockSubmitOOOForm.mockResolvedValue({ success: true });
    mockCancelOOO.mockResolvedValue({ success: true });
  });

  it("renders loading state when token is missing", () => {
    mockToken = null;
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("renders loading state when store loading is true", () => {
    mockLoading = true;
    const { getByText } = render(<HomeScreen />);
    expect(getByText("Loading...")).toBeTruthy();
  });

  it("fetches user status on mount if token exists", async () => {
    render(<HomeScreen />);
    await waitFor(() => {
      expect(mockFetchUserStatus).toHaveBeenCalledWith("mock-token");
    });
  });

  it("displays UNKNOWN status if userStatus is missing", () => {
    mockUserStatus = null;
    const { getByText } = render(<HomeScreen />);
    expect(getByText("UNKNOWN")).toBeVisible();
  });

  describe("StatusUpdateForm Interaction", () => {
    it("closes the form when the close icon is pressed", async () => {
      const { getByText, getByTestId, queryByText } = render(<HomeScreen />);

      fireEvent.press(getByText("Submit OOO"));
      expect(getByText("Update Status")).toBeVisible();
      fireEvent.press(getByTestId("close-button"));

      expect(queryByText("Update Status")).toBeNull();
      expect(getByText("Submit OOO")).toBeVisible();
    });

    it("allows a user to fill out and submit the form", async () => {
      mockSubmitOOOForm.mockResolvedValueOnce({ success: true });
      const { getByText, findByPlaceholderText, queryByText } = render(
        <HomeScreen />
      );

      fireEvent.press(getByText("Submit OOO"));

      const fromDateButton = getByText("Select From Date");
      fireEvent.press(fromDateButton);
      const fromDate = new Date("2024-01-10");
      await act(async () => {
        mockOnConfirm(fromDate);
      });

      const toDateButton = getByText("Select To Date");
      fireEvent.press(toDateButton);
      const toDate = new Date("2024-01-12");
      await act(async () => {
        mockOnConfirm(toDate);
      });

      const descriptionInput = await findByPlaceholderText("Add description");
      fireEvent.changeText(descriptionInput, "Team offsite");

      await act(async () => {
        fireEvent.press(getByText("Submit"));
        await mockSubmitOOOForm();
      });

      expect(queryByText("Update Status")).toBeNull();
      expect(mockSubmitOOOForm).toHaveBeenCalledWith(
        expect.objectContaining({ description: "Team offsite" }),
        "mock-token"
      );
      expect(Alert.alert).toHaveBeenCalledWith(
        "Success",
        "Your status has been updated to OOO."
      );
    });

    it("shows error alert on failed submission", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockSubmitOOOForm.mockRejectedValueOnce(new Error("Submit failed"));

      const { getByText, findByPlaceholderText } = render(<HomeScreen />);

      fireEvent.press(getByText("Submit OOO"));

      fireEvent.press(getByText("Select From Date"));
      await act(async () => {
        mockOnConfirm(new Date("2024-02-01"));
      });
      fireEvent.press(getByText("Select To Date"));
      await act(async () => {
        mockOnConfirm(new Date("2024-02-05"));
      });
      const descriptionInput = await findByPlaceholderText("Add description");
      fireEvent.changeText(descriptionInput, "Test");

      fireEvent.press(getByText("Submit"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Failed to update your status. Please try again."
        );
      });
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Cancel OOO Flow", () => {
    beforeEach(() => {
      mockUserStatus = { data: { currentStatus: { state: "OOO" } } };
    });

    it("displays Cancel OOO button when status is OOO", () => {
      const { getByText, queryByText } = render(<HomeScreen />);
      expect(getByText("Cancel OOO")).toBeTruthy();
      expect(queryByText("Submit OOO")).toBeNull();
    });

    it("calls cancelOOO and shows success alert on successful cancellation", async () => {
      const { getByText } = render(<HomeScreen />);
      fireEvent.press(getByText("Cancel OOO"));

      await waitFor(() => {
        expect(mockCancelOOO).toHaveBeenCalledWith("mock-token");
        expect(Alert.alert).toHaveBeenCalledWith(
          "Success",
          "Your status has been updated to ACTIVE."
        );
      });
    });

    it("shows loading indicator on Cancel OOO button while cancelling", async () => {
      let resolveCancel: (value: unknown) => void;
      mockCancelOOO.mockImplementationOnce(
        () => new Promise((res) => (resolveCancel = res))
      );

      const { getByText, getByTestId, queryByText } = render(<HomeScreen />);
      fireEvent.press(getByText("Cancel OOO"));

      await waitFor(() => {
        expect(getByTestId("loading-indicator")).toBeTruthy();
        expect(queryByText("Cancel OOO")).toBeNull();
      });

      await act(async () => {
        resolveCancel({ success: true });
      });

      await waitFor(() => {
        expect(getByText("Cancel OOO")).toBeTruthy();
      });
    });
    it("shows an error alert if cancelling OOO fails", async () => {
      const consoleErrorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      mockCancelOOO.mockRejectedValueOnce(new Error("API Error"));

      const { getByText } = render(<HomeScreen />);
      fireEvent.press(getByText("Cancel OOO"));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          "Error",
          "Failed to cancel your OOO status. Please try again."
        );
      });
      consoleErrorSpy.mockRestore();
    });
  });
});
