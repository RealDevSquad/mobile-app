import { registerRootComponent } from 'expo';
import React from 'react';
import { View } from 'react-native';

class App extends React.Component {
  render() {
    return <View />;
  }
}

registerRootComponent(App);
