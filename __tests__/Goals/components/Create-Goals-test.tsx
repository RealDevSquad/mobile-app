import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import CreateGoals from '../../../src/components/ToDoComponent/SettingGoals/CreateGoals';
import { Alert } from 'react-native';
import {
  mockGoalData,
  mockUsersData,
} from '../../../__mocks__/mockData/Goals/mockData';

const axios = require('axios');
jest.mock('axios');
jest.mock('react-native-gesture-handler', () => {});

describe('MainScreen', () => {
  const navigationProp = { navigate: jest.fn() };

  test('renders title and input fields correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <CreateGoals navigation={navigationProp} />,
    );
    const titleText = getByText('Create New Goal');
    const titleInput = getByPlaceholderText(
      'Enter title max of 50 characters.',
    );
    const descriptionInput = getByPlaceholderText('Enter max 200 characters.');
    expect(titleText).toBeTruthy();
    expect(titleInput).toBeTruthy();
    expect(descriptionInput).toBeTruthy();
  });

  test('navigates to MemberScreen when "Assigned To" is pressed', async () => {
    const navigateMock = jest.fn();
    axios.get.mockResolvedValue({
      data: { users: mockUsersData, message: 'Users returned successfully!' },
    });
    const { getByTestId, findByTestId } = render(
      <CreateGoals navigation={{ navigate: navigateMock }} />,
    );

    const dropdown = getByTestId('dropdown');
    expect(dropdown).toBeTruthy();

    fireEvent.press(dropdown);

    const usersContainer = await findByTestId('user-container');
    expect(usersContainer).toBeTruthy();
    // const assignedToText = getByText("Enter member's name");
    // fireEvent.press(assignedToText);
    // expect(navigateMock).toHaveBeenCalledWith(
    //   "Member's page",
    //   expect.any(Object),
    // );
  });

  test('should not show dropdown when "Assigned to: " button clicked twice', () => {
    const navigateMock = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <CreateGoals navigation={{ navigate: navigateMock }} />,
    );

    const dropdown = getByTestId('dropdown');
    expect(dropdown).toBeTruthy();

    fireEvent.press(dropdown);
    fireEvent.press(dropdown);

    const userContainer = queryByTestId('user-container');
    expect(userContainer).toBeNull();
  });

  test('navigates to Goal Screen when "Create Goal" button is pressed', async () => {
    const spyAlert = jest.spyOn(Alert, 'alert');
    axios.get.mockResolvedValue({
      data: { users: mockUsersData, message: 'Users returned successfully!' },
    });
    axios.post.mockResolvedValue(mockGoalData);

    const {
      getByTestId,
      getByPlaceholderText,
      getByText,
      findByTestId,
      getAllByText,
    } = render(<CreateGoals navigation={navigationProp} />);

    const createGoalButton = getByText(/create goal/i);
    const titleInput = getByPlaceholderText(
      'Enter title max of 50 characters.',
    );
    const descriptionInput = getByPlaceholderText('Enter max 200 characters.');
    const selectUserButton = getByTestId('dropdown');

    fireEvent.press(selectUserButton);
    const userContainer = await findByTestId('user-container');
    expect(userContainer).toBeTruthy();

    const userInput = getByPlaceholderText('Search User');
    await waitFor(() => {
      fireEvent.changeText(userInput, 'test user');
    });
    const userItems = getAllByText(/test user/i);
    expect(userItems).toBeTruthy();

    await waitFor(() => {
      fireEvent.press(userItems[0]);
      fireEvent.changeText(titleInput, 'Test Goal');
      fireEvent.changeText(descriptionInput, 'Test Description');
    });

    fireEvent.press(createGoalButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Success',
        `Task has been created and assigned to test user`,
        [{ text: 'OK', onPress: expect.any(Function) }],
      );
    });

    const alertMockCall = spyAlert.mock.calls?.[0]?.[2]?.[0];
    alertMockCall?.onPress!();
    
    expect(navigationProp.navigate).toHaveBeenCalledWith('GoalsScreen');
  });
});
