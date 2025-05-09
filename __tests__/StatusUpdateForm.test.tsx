import StatusUpdateForm from "@/components/StatusUpdateForm";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

let latestDatePickerProps: any = {};
jest.mock("react-native-date-picker", () => {
  return (props: any) => {
    if (props.open) {
      latestDatePickerProps = props;
    }
    return null;
  };
});

jest.spyOn(Alert, "alert").mockImplementation(() => {});

const formatDateForTest = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

describe("StatusUpdateForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnClose.mockClear();
    (Alert.alert as jest.Mock).mockClear();
    latestDatePickerProps = {};
  });

  it("renders correctly with initial state", () => {
    render(<StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    expect(screen.getByText("Update Status")).toBeTruthy();
    expect(screen.getByText("Select From Date")).toBeTruthy();
    expect(screen.getByText("Select To Date")).toBeTruthy();
    expect(screen.getByPlaceholderText("Add description")).toBeTruthy();
    expect(screen.getByText("Submit")).toBeTruthy();
    expect(screen.getByTestId("close-button")).toBeTruthy();
  });

  it("calls onClose when the close button is pressed", () => {
    render(<StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    fireEvent.press(screen.getByTestId("close-button"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  describe("Date Pickers", () => {
    it("opens From Date picker, selects a date, and updates display", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      const fromDateButton = screen.getByText("Select From Date");
      await act(async () => {
        fireEvent.press(fromDateButton);
      });
      const selectedDate = new Date(2023, 0, 15);
      await act(async () => {
        latestDatePickerProps.onConfirm(selectedDate);
      });
      await waitFor(() => {
        expect(screen.getByText(formatDateForTest(selectedDate))).toBeTruthy();
      });
    });

    it("opens To Date picker, selects a date, and updates display", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      const toDateButton = screen.getByText("Select To Date");
      await act(async () => {
        fireEvent.press(toDateButton);
      });
      const selectedDate = new Date(2023, 1, 20);
      await act(async () => {
        latestDatePickerProps.onConfirm(selectedDate);
      });
      await waitFor(() => {
        expect(screen.getByText(formatDateForTest(selectedDate))).toBeTruthy();
      });
    });

    it("cancels From Date picker without changing the date", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      const fromDateButton = screen.getByText("Select From Date");
      await act(async () => {
        fireEvent.press(fromDateButton);
      });
      await act(async () => {
        latestDatePickerProps.onCancel();
      });
      expect(screen.getByText("Select From Date")).toBeTruthy();
    });
  });

  it("updates description when text is entered", () => {
    render(<StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />);
    const descriptionInput = screen.getByPlaceholderText("Add description");
    fireEvent.changeText(descriptionInput, "Test description");
    expect(descriptionInput.props.value).toBe("Test description");
  });

  describe("Form Submission", () => {
    const fromDate = new Date(2023, 0, 1);
    const toDate = new Date(2023, 0, 10);
    const description = "Valid description";

    const fillValidForm = async () => {
      await act(async () => {
        fireEvent.press(screen.getByText("Select From Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(fromDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(fromDate)));
      await waitFor(() => screen.getByText("Select To Date"));
      await act(async () => {
        fireEvent.press(screen.getByText("Select To Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(toDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(toDate)));
      await act(async () => {
        fireEvent.changeText(
          screen.getByPlaceholderText("Add description"),
          description
        );
      });
    };

    it("calls onSubmit with correct data and resets form on valid submission", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      await fillValidForm();
      fireEvent.press(screen.getByText("Submit"));
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);

      const actualArgs = mockOnSubmit.mock.calls[0];
      const actualFromDate = actualArgs[0] as Date;
      const actualToDate = actualArgs[1] as Date;
      const actualDescription = actualArgs[2] as string;

      expect(actualFromDate.getTime()).toBe(fromDate.getTime());
      expect(actualToDate.getTime()).toBe(toDate.getTime());
      expect(actualDescription).toBe(description);

      await waitFor(() => {
        expect(screen.getByText("Select From Date")).toBeTruthy();
        expect(screen.getByText("Select To Date")).toBeTruthy();
        expect(screen.getByPlaceholderText("Add description").props.value).toBe(
          ""
        );
      });
      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it("shows alert and does not submit if From Date is missing", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      await act(async () => {
        fireEvent.press(screen.getByText("Select To Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(toDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(toDate)));
      await act(async () => {
        fireEvent.changeText(
          screen.getByPlaceholderText("Add description"),
          "Test"
        );
      });
      fireEvent.press(screen.getByText("Submit"));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please select both From Date and To Date."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("shows alert and does not submit if To Date is missing", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      await act(async () => {
        fireEvent.press(screen.getByText("Select From Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(fromDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(fromDate)));
      await act(async () => {
        fireEvent.changeText(
          screen.getByPlaceholderText("Add description"),
          "Test"
        );
      });
      fireEvent.press(screen.getByText("Submit"));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Please select both From Date and To Date."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("shows alert and does not submit if From Date is not before To Date", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      const invalidFromDate = new Date(2023, 0, 15);
      const invalidToDate = new Date(2023, 0, 10);
      await act(async () => {
        fireEvent.press(screen.getByText("Select From Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(invalidFromDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(invalidFromDate)));
      await waitFor(() => screen.getByText("Select To Date"));
      await act(async () => {
        fireEvent.press(screen.getByText("Select To Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(invalidToDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(invalidToDate)));
      await act(async () => {
        fireEvent.changeText(
          screen.getByPlaceholderText("Add description"),
          "Test"
        );
      });
      fireEvent.press(screen.getByText("Submit"));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "From Date must be less than To Date."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("shows alert and does not submit if From Date is same as To Date", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      const sameDate = new Date(2023, 0, 15);
      const descriptionForTest = "Test";

      fireEvent.press(screen.getByText("Select From Date"));
      await act(async () => {
        latestDatePickerProps.onConfirm?.(sameDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(sameDate)));

      fireEvent.press(screen.getByText("Select To Date"));
      await act(async () => {
        latestDatePickerProps.onConfirm?.(sameDate);
      });

      await waitFor(() => {
        const dateElements = screen.getAllByText(formatDateForTest(sameDate));
        expect(dateElements.length).toBe(2);
      });

      fireEvent.changeText(
        screen.getByPlaceholderText("Add description"),
        descriptionForTest
      );
      fireEvent.press(screen.getByText("Submit"));

      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "From Date must be less than To Date."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("shows alert and does not submit if description is missing", async () => {
      render(
        <StatusUpdateForm onSubmit={mockOnSubmit} onClose={mockOnClose} />
      );
      await act(async () => {
        fireEvent.press(screen.getByText("Select From Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(fromDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(fromDate)));
      await waitFor(() => screen.getByText("Select To Date"));
      await act(async () => {
        fireEvent.press(screen.getByText("Select To Date"));
      });
      await act(async () => {
        latestDatePickerProps.onConfirm(toDate);
      });
      await waitFor(() => screen.getByText(formatDateForTest(toDate)));
      fireEvent.press(screen.getByText("Submit"));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Description is required."
      );
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
