import React, { useState, useContext, useCallback } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../../context/AuthContext';
import DisplayContribution from '../../../components/DisplayContribution';
import Loader from '../../../components/Loader';
import { fetchActiveTasks } from '../../AuthScreen/Util';

const ActiveScreen = () => {
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { loggedInUserData } = useContext(AuthContext);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      (async () => {
        const token = loggedInUserData?.token;

        const tasksRes = await fetchActiveTasks(token as string);
        const activeTaskRes = tasksRes.filter(
          (item: { status: string }) => item.status !== 'COMPLETED',
        );
        setActiveTasks(activeTaskRes);
        setLoading(false);
      })();
    }, [loggedInUserData?.token]),
  );
  return (
    <View>
      {loading ? <Loader /> : <DisplayContribution tasks={activeTasks} />}
    </View>
  );
};

export default ActiveScreen;
