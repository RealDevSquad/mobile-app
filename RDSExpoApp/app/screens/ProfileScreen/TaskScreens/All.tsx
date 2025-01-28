import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useContext, useState } from 'react';
import { AuthContext } from '../../../../components/context/AuthContext';
import DisplayContribution from '../../../../components/src/DisplayContribution';
import Loader from '../../../../components/src/Loader';
import { fetchAllTasks } from '../../AuthScreen/Util';

const All = () => {
  const [allTask, setAllTask] = useState([]);
  const { loggedInUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);

      (async () => {
        const token = loggedInUserData?.token;

        const allTasks = await fetchAllTasks(token as string);
        setAllTask(allTasks);
        setLoading(false);
      })();
    }, [loggedInUserData?.token]),
  );

  return (
    <>{loading ? <Loader /> : <DisplayContribution tasks={allTask} />}</>
    //TODO: to call AllTaskDetailScreen
    // <ScrollView style={{ padding: 10, elevation: 10 }}>
    //   {isProdEnvironment ? (
    //     <AllTaskDetailScreen />
    //   ) : (
    //     <DisplayContribution tasks={allContributionsData} />
    //   )}
    //   </ScrollView>
  );
};
export default All;
