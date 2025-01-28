import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import SearchBar from '../../../components/src/SearchBar';
import RenderMemberItem from '../../../components/src/ToDoComponent/RenderMemberItem';
import GoalsApi from '../../../constants/apiConstant/GoalsApi';

type MembersPageRouteProp = RouteProp<RootStackParamList, "Member's page">;

const MembersPage = () => {
  const route = useRoute<MembersPageRouteProp>();
  const [membersData, setMembersData] = useState([]);
  const [filterMemberData, setFilterMemberData] = useState([]);
  const { selectedMember, setSelectedMember } = route.params;
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState<null | string>(null);

  useEffect(() => {
    callMembersApi();
  }, [selectedMember]);

  const callMembersApi = async () => {
    try {
      // Set loading state
      setLoading(true);

      const members = await fetch(GoalsApi.MEMBERS_API);
      const membersJsonData = await members.json();

      // Set members data and clear loading and error states
      setMembersData(membersJsonData.members);
      setFilterMemberData(membersJsonData.members);
      setLoading(false);
      setErrorState(null);
    } catch (error) {
      // Set error state and clear loading state
      setErrorState('Network error!');
      setLoading(false);
    }
  };

  const renderLoader = () => {
    return loading ? (
      <View style={styles.loaderView}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  };

  const renderError = () => {
    if (errorState) {
      return Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'error',
      });
    }
  };

  return (
    errorState ??
    renderError ??
    loading ??
    renderLoader ?? (
      <View style={styles.container}>
        <Text style={styles.title}>Real Dev Squad Member's</Text>
        <SearchBar
          setSearchValue={setSearchValue}
          searchValue={searchValue}
          membersData={filterMemberData}
          setMembersData={setMembersData}
        />
        <FlatList
          data={membersData}
          renderItem={({ item }) => (
            <RenderMemberItem
              item={item}
              setSelectedMember={setSelectedMember}
            />
          )}
          keyExtractor={(item) => item.id}
          ListFooterComponent={renderLoader}
        />
      </View>
    )
  );
};

export default MembersPage;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 4, backgroundColor: '#F5F5F5' },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'blue',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
    textAlign: 'center',
    margin: 2,
  },
  loaderView: { alignItems: 'center', paddingVertical: 20 },
});
