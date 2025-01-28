import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Image, Platform, Text } from 'react-native';
import { useSelector } from 'react-redux';
import GoalsScreenStack from '../../../app/screens/GoalScreen/GoalScreen';
import HomeScreenV2 from '../../../app/screens/HomeScreen/HomeScreenV2';
import NotifyScreen from '../../../app/screens/NotifyScreen/NotifyScreen';
import { AllTaskScreenStack } from '../../../app/screens/Stacks/AllStack';
import Colors from '../../../constants/colors/Colors';
import Fonts from '../../../constants/fonts/TabFont';
import Images from '../../../constants/images/Image';
import Strings from '../../i18n/en';
import { scale } from '../../utils/utils';
import { TabViewStyle } from './style';

const tab = createBottomTabNavigator();

const TabNavigation = () => {
  const { isProdEnvironment } = useSelector((store) => store.localFeatureFlag);

  return (
    <NavigationContainer independent>
      <tab.Navigator
        initialRouteName={Strings.Tab_Home}
        screenOptions={() => ({
          headerShown: false,
          // tabBarStyle: TabViewStyle.tab_bar,
          tabBarStyle: {
            paddingVertical: Platform.OS === 'ios' ? 20 : 0,
            height: scale(55),
          },
        })}
      >
        <tab.Screen
          name={Strings.Tab_Home}
          component={HomeScreenV2}
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    fontSize: Fonts.Tab_Text_Font,
                    color: focused
                      ? Colors.Tab_Active_Color
                      : Colors.Tab_Inactive_Color,
                  }}
                >
                  {Strings.Tab_Home}
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              return (
                <Image
                  style={TabViewStyle.tab_icon}
                  source={focused ? Images.homeIcon : Images.homeIconUnF}
                />
              );
            },
          }}
        />

        {!isProdEnvironment && (
          <tab.Screen
            name={Strings.Tab_Goal}
            component={GoalsScreenStack}
            options={{
              headerShown: false,

              tabBarLabel: ({ focused }) => {
                return (
                  <Text
                    style={{
                      fontSize: Fonts.Tab_Text_Font,
                      color: focused
                        ? Colors.Tab_Active_Color
                        : Colors.Tab_Inactive_Color,
                    }}
                  >
                    {Strings.Tab_Goal}
                  </Text>
                );
              },
              tabBarIcon: ({ focused }) => {
                return (
                  <Image
                    style={TabViewStyle.tab_icon}
                    source={focused ? Images.goalIcon : Images.goalIconUnF}
                  />
                );
              },
            }}
          />
        )}

        <tab.Screen
          name={Strings.Tab_Notify}
          component={NotifyScreen}
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    fontSize: Fonts.Tab_Text_Font,
                    color: focused
                      ? Colors.Tab_Active_Color
                      : Colors.Tab_Inactive_Color,
                  }}
                >
                  {Strings.Tab_Notify}
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              return (
                <Image
                  style={TabViewStyle.tab_icon}
                  source={focused ? Images.profileIcon : Images.profileIconUnF}
                />
              );
            },
          }}
        />

        <tab.Screen
          name={Strings.Tab_Profile}
          component={AllTaskScreenStack}
          options={{
            headerShown: false,
            tabBarLabel: ({ focused }) => {
              return (
                <Text
                  style={{
                    fontSize: Fonts.Tab_Text_Font,
                    color: focused
                      ? Colors.Tab_Active_Color
                      : Colors.Tab_Inactive_Color,
                  }}
                >
                  {Strings.Tab_Profile}
                </Text>
              );
            },
            tabBarIcon: ({ focused }) => {
              return (
                <Image
                  style={TabViewStyle.tab_icon}
                  source={focused ? Images.profileIcon : Images.profileIconUnF}
                />
              );
            },
          }}
        />
      </tab.Navigator>
    </NavigationContainer>
  );
};

export default TabNavigation;
