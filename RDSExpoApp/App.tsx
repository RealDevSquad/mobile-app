import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import createSagaMiddleware from '@redux-saga/core';
import React, { useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Provider, useSelector } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';

import AuthScreen from './app/screens/AuthScreen/AuthScreen';
import ConnectionScreen from './app/screens/ConnectionScreen/ConnectionScreen';
import AuthContext, { AuthProvider } from './components/context/AuthContext';
import TabNavigation from './components/navigations/TabNavigation/TabNavigation';
import reducers from './components/reducers';
import rootSaga from './components/sagas/rootSaga';
import LoadingScreen from './components/src/LoadingScreen';


const sagaMiddleware = createSagaMiddleware();
const store = compose(applyMiddleware(sagaMiddleware))(createStore)(reducers);
sagaMiddleware.run(rootSaga);


const Stack = createStackNavigator();

const App = () => {
 
  const { isLoading, loggedInUserData } = useContext(AuthContext);

  
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
 
  const { isProdEnvironment } = useSelector((store: any) => store.localFeatureFlag);

 
  const retryConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected ?? false);
    } catch (error) {
      console.error(error);
    }
  };

 
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  
  if (isLoading) {
    return <LoadingScreen />;
  }

  
  if (!isConnected) {
    return <ConnectionScreen retryConnect={retryConnection} />;
  }

  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {loggedInUserData ? (
              <Stack.Screen name="Home" component={TabNavigation} />
            ) : (
              <Stack.Screen name="Auth" component={AuthScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
      <Toast />
    </Provider>
  );
};

export default App;
