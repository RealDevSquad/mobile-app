import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../ProfileScreen/ProfileScreen';
import ActiveTaskDetail from '../ProfileScreen/DetailScreen/ActiveTaskDetail';
import ExtensionRequest from '../../components/ProfileExtensionForm/ExtensionRequest';

const Stack = createStackNavigator();
function ActiveTaskScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ActiveTaskDetail" component={ActiveTaskDetail} />
      <Stack.Screen name="ExtensionRequest" component={ExtensionRequest} />
    </Stack.Navigator>
  );
}

export default ActiveTaskScreenStack;
