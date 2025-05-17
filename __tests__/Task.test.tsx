import { render } from "@testing-library/react-native";
import { useRouter } from "expo-router";
import React from "react";
import Task from "../components/Task";

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

const mockNavigate = jest.fn();
(useRouter as jest.Mock).mockReturnValue({ navigate: mockNavigate });

const mockTasks = [
  {
    id: "1",
    title: "Task 1",
    createdBy: "Alice",
    assignee: "Bob",
    endsOn: 1700000000, // unix timestamp
    startedOn: 1690000000,
    status: "Open",
  },
  {
    id: "2",
    title: "Task 2",
    createdBy: "Charlie",
    assignee: "Dave",
    endsOn: 1710000000,
    startedOn: 1705000000,
    status: "In Progress",
  },
];

describe("Task component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders a list of tasks", () => {
    const { getByText, getAllByText } = render(<Task tasks={mockTasks} />);
    expect(getByText("Task 1")).toBeTruthy();
    expect(getByText("Task 2")).toBeTruthy();
    expect(getAllByText(/Created By:/).length).toBe(2);
    expect(getAllByText(/Assignee:/).length).toBe(2);
    expect(getAllByText(/Ends On:/).length).toBe(2);
    expect(getAllByText(/Started On:/).length).toBe(2);
    expect(getByText("Status: Open")).toBeTruthy();
    expect(getByText("Status: In Progress")).toBeTruthy();
  });

  it("renders empty state when no tasks", () => {
    const { getByText } = render(<Task tasks={[]} />);
    expect(getByText("No active tasks found...")).toBeTruthy();
  });

  it("renders empty state when tasks is undefined", () => {
    // @ts-expect-error: testing undefined prop
    const { getByText } = render(<Task />);
    expect(getByText("No active tasks found...")).toBeTruthy();
  });

  //   it("navigates to details page with correct params on task press", () => {
  //     const { getByText } = render(<Task tasks={mockTasks} />);
  //     fireEvent.press(getByText("Task 1"));
  //     expect(mockNavigate).toHaveBeenCalledWith({
  //       pathname: "/(tabs)/(profile)/details",
  //       params: expect.objectContaining({
  //         id: "1",
  //         title: "Task 1",
  //         createdBy: "Alice",
  //         assignee: "Bob",
  //         endsOn: 1700000000,
  //         startedOn: 1690000000,
  //         status: "Open",
  //       }),
  //     });
  //   });
});
