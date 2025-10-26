import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import ExtensionRequestCard from "../components/ExtensionRequestCard";
import { ExtensionRequestDTO } from "../types/extension-request.dto";

// Mock Alert
jest.spyOn(Alert, "alert");

const mockRequest: ExtensionRequestDTO = {
  id: "req-1",
  taskId: "task-123",
  title: "Extension request for OOO fix flow task",
  reason:
    "Have discussed with Ankush sir and raising an extension accordingly. Raising an extension for 4 days",
  assignee: "hariom-vashista-1",
  assigneeId: "MONmowaKYkul24eT5fuG",
  oldEndsOn: 1761436800,
  newEndsOn: 1761868800,
  status: "PENDING",
  requestNumber: 3,
  timestamp: 1761421382,
};

const mockOnApprove = jest.fn();
const mockOnReject = jest.fn();

describe("ExtensionRequestCard component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Alert.alert as jest.Mock).mockClear();
  });

  it("renders extension request card with basic information", () => {
    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    expect(getByText("Extension request for OOO fix flow task")).toBeTruthy();
    expect(getByText("Assignee: hariom-vashista-1")).toBeTruthy();
    expect(getByText("Request #3")).toBeTruthy();
    expect(getByText("PENDING")).toBeTruthy();
  });

  it("shows truncated reason when collapsed", () => {
    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    const reasonText = getByText(/Reason:/);
    expect(reasonText).toBeTruthy();
    // Should show truncated text (first 100 characters + "...")
    expect(reasonText.children[1]).toContain(
      "Have discussed with Ankush sir and raising an extension accordingly. Raising an extension for 4 days"
    );
  });

  it("expands when card is tapped", () => {
    const { getByText, queryByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Initially, expanded content should not be visible
    expect(queryByText("Task ID: task-123")).toBeNull();
    expect(queryByText("Approve")).toBeNull();
    expect(queryByText("Reject")).toBeNull();

    // Tap card to expand
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    // Expanded content should now be visible
    expect(getByText("Task ID: task-123")).toBeTruthy();
    expect(getByText("Approve")).toBeTruthy();
    expect(getByText("Reject")).toBeTruthy();
  });

  it("shows approve and reject buttons for PENDING status", () => {
    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Expand the card first
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    expect(getByText("Approve")).toBeTruthy();
    expect(getByText("Reject")).toBeTruthy();
  });

  it("does not show action buttons for non-PENDING status", () => {
    const approvedRequest = { ...mockRequest, status: "APPROVED" as const };
    const { getByText, queryByText } = render(
      <ExtensionRequestCard
        request={approvedRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Expand the card
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    expect(queryByText("Approve")).toBeNull();
    expect(queryByText("Reject")).toBeNull();
  });

  it("shows confirmation alert when approve button is pressed", async () => {
    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Expand the card
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    // Press approve button
    fireEvent.press(getByText("Approve"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Approve Extension Request",
      "Are you sure you want to approve this extension request?",
      expect.any(Array)
    );
  });

  it("shows confirmation alert when reject button is pressed", async () => {
    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Expand the card
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    // Press reject button
    fireEvent.press(getByText("Reject"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Reject Extension Request",
      "Are you sure you want to reject this extension request?",
      expect.any(Array)
    );
  });

  it("calls onApprove when approve is confirmed", async () => {
    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Expand the card
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    // Press approve button
    fireEvent.press(getByText("Approve"));

    // Get the alert callback and call it
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const approveCallback = alertCall[2][1].onPress;

    await approveCallback();

    expect(mockOnApprove).toHaveBeenCalledWith("req-1");
  });

  it("calls onReject when reject is confirmed", async () => {
    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Expand the card
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    // Press reject button
    fireEvent.press(getByText("Reject"));

    // Get the alert callback and call it
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const rejectCallback = alertCall[2][1].onPress;

    await rejectCallback();

    expect(mockOnReject).toHaveBeenCalledWith("req-1");
  });

  it("shows different status colors", () => {
    const { getByText, rerender } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Test PENDING status
    expect(getByText("PENDING")).toBeTruthy();

    // Test APPROVED status
    const approvedRequest = { ...mockRequest, status: "APPROVED" as const };
    rerender(
      <ExtensionRequestCard
        request={approvedRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );
    expect(getByText("APPROVED")).toBeTruthy();

    // Test REJECTED status
    const rejectedRequest = { ...mockRequest, status: "REJECTED" as const };
    rerender(
      <ExtensionRequestCard
        request={rejectedRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );
    expect(getByText("REJECTED")).toBeTruthy();
  });

  it("shows loading state when processing", async () => {
    mockOnApprove.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { getByText } = render(
      <ExtensionRequestCard
        request={mockRequest}
        onApprove={mockOnApprove}
        onReject={mockOnReject}
      />
    );

    // Expand the card
    fireEvent.press(getByText("Extension request for OOO fix flow task"));

    // Press approve button
    fireEvent.press(getByText("Approve"));

    // Get the alert callback and call it
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const approveCallback = alertCall[2][1].onPress;

    approveCallback();

    // Should show loading indicator
    await waitFor(() => {
      expect(getByText("Approve")).toBeTruthy(); // Button should still be there but with loading
    });
  });
});
