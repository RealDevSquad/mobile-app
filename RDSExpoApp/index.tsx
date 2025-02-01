import NetInfo from '@react-native-community/netinfo';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AuthScreen from './app/screens/AuthScreen/AuthScreen';
import ConnectionScreen from './app/screens/ConnectionScreen/ConnectionScreen';
import AuthContext from './components/context/AuthContext';
import TabNavigation from './components/navigations/TabNavigation/TabNavigation';
import LoadingScreen from './components/src/LoadingScreen';


const Index = () => {
  const { isLoading, loggedInUserData } = useContext(AuthContext);
  const [isConnected, setIsConnected] = useState(false);
    const { isProdEnvironment } = useSelector(
      (store) => store.localFeatureFlag,
    );

  const retryConnection = async () => {
    try {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);
    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, [isConnected]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isConnected && !isProdEnvironment) {
    return <ConnectionScreen retryConnect={retryConnection} />;
  }

  if (!loggedInUserData) {
    return <AuthScreen />;
  }

  return <TabNavigation />;
};

export default Index;
