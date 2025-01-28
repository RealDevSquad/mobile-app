import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { View } from 'react-native';
import { AuthContext } from '../../../../components/context/AuthContext';
import DisplayContribution from '../../../../components/src/DisplayContribution';
import Loader from '../../../../components/src/Loader';
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
