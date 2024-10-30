import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TodoComponent from '../../../src/components/ToDoComponent/TodoComponent';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});

describe('TodoComponent', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders title correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <TodoComponent />
      </NavigationContainer>,
    );
    const titleElement = getByText("To Do's");
    expect(titleElement).toBeTruthy();
  });

  test('renders "Add" button correctly', () => {
    const { getByText } = render(
      <NavigationContainer>
        <TodoComponent />
      </NavigationContainer>,
    );
    const addButton = getByText('Add');
    expect(addButton).toBeTruthy();
  });

  test('calls navigationProp.navigate when "Add" button is pressed', async () => {
    const navigate = jest.fn();
    require('@react-navigation/native').useNavigation.mockReturnValue({
      navigate,
    });

    const { getByText } = render(
      <NavigationContainer>
        <TodoComponent />
      </NavigationContainer>,
    );
    const addButton = getByText('Add');
    fireEvent.press(addButton);
    expect(navigate).toHaveBeenCalledWith('CreatingGoals');
  });
});
