import * as React from 'react';
import {Image} from 'react-native';
import {
  HomeScreenNavigator,
  MoreScreenNvigator,
  FavouriteScreenNvigator,
  LinesScreenNvigator,
} from './StackNavigation';

import DirectionIcon from '../../Assets/NewImages/Direction.png';
import Dots from '../../Assets/NewImages/Dots.png';
import MapBottom from '../../Assets/NewImages/MapBottom.png';
import Home from '../../Assets/NewImages/Home.png';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 20,
          paddingTop: 20,
          height: 90,
          paddingLeft: 5,
          paddingRight: 5,
        },
        tabBarItemStyle: {
          borderRadius: 50,
        },
      }}
      tabBarOptions={{
        showLabel: false,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreenNavigator}
        options={{
          header: () => null,
          unmountOnBlur: true,
          tabBarLabel: 'Search',
          tabBarIcon: ({focused}) => (
            <Image
              source={Home}
              color={'#000'}
              style={{
                tintColor: focused ? '#000' : '#B9B9B9',
                height: 25,
                width: 28,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="LineScreen"
        component={LinesScreenNvigator}
        options={{
          header: () => null,
          unmountOnBlur: true,
          tabBarIcon: ({focused}) => (
            <Image
              source={DirectionIcon}
              color={'#000'}
              style={{
                tintColor: focused ? '#000' : '#B9B9B9',
                height: 25,
                width: 28,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="FavouriteScreen"
        component={FavouriteScreenNvigator}
        options={{
          header: () => null,
          unmountOnBlur: true,
          tabBarLabel: 'Search',
          tabBarIcon: ({focused}) => (
            <Image
              source={MapBottom}
              color={'#000'}
              style={{
                tintColor: focused ? '#000' : '#B9B9B9',
                height: 25,
                width: 28,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="MoreScreen"
        component={MoreScreenNvigator}
        options={{
          header: () => null,
          unmountOnBlur: true,
          tabBarLabel: 'Search',
          tabBarIcon: ({focused}) => (
            <Image
              source={Dots}
              color={'#000'}
              style={{
                tintColor: focused ? '#000' : '#B9B9B9',
                height: 21,
                width: 48,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
