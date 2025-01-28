import React, { useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import 'react-native-gesture-handler';
// import dropDownImage from '../../../../assets/dropdown';
// import dropUpImage from '../../../../assets/dropup';
import { AuthContext } from '../../../context/AuthContext';
import StyleConfig from '../../../utils/StyleConfig';
import { scale } from '../../../utils/utils';
import { PostGoal, getAllUsers } from './../../../../app/screens/AuthScreen/Util';
import DeadLineDatePicker from './SettingGoalsComponents/DeadLineDatePicker';

const MainScreen = ({ navigation }) => {
  const [titleText, setTitleText] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [isDropDownSelected, setIsDropDownSelected] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { loggedInUserData } = useContext(AuthContext);
  const [titleError, setTitleError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [date, setDate] = useState(new Date());

  const selectDropDown = () => {
    Keyboard.dismiss();
    setIsDropDownSelected(!isDropDownSelected);
  };

  const handleDropDownPress = (item) => {
    setSelectedUser(item);
    setIsDropDownSelected(false);
  };

  // const fetchData = useCallback(async () => {
  //   console.log('calling api');
  //   if (loggedInUserData?.token) {
  //     const allUser = await getAllUsers(loggedInUserData.token);
  //     setAllUsers(allUser);
  //     setIsLoading(false);
  //   }
  // }, [loggedInUserData?.token]);

  const postNewGoal = async () => {
    setTitleError('');
    setDescriptionError('');

    // Check if title is empty
    if (!titleText.trim()) {
      setTitleError('Title is required');
      return;
    }

    // Check if description is empty
    if (!descriptionText.trim()) {
      setDescriptionError('Description is required');
      return;
    }

    // Proceed with posting the goal
    // PostGoal(goalsData?.user?.token?.access, titleText, descriptionText)
    const response = await PostGoal(
      titleText,
      descriptionText,
      loggedInUserData?.id,
      selectedUser?.id,
      date,
      loggedInUserData?.name,
    );
    if (response) {
      if (selectedUser?.first_name) {
        Alert.alert(
          'Success',
          `Task has been created and assigned to ${selectedUser?.first_name}`,
          [{ text: 'OK', onPress: () => navigation.navigate('GoalsScreen') }],
        );
      } else {
        Alert.alert('Success', 'Task has been created successfully', [
          { text: 'OK', onPress: () => navigation.navigate('GoalsScreen') },
        ]);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      console.log('calling api');
      const allUser = await getAllUsers(loggedInUserData?.token);
      setAllUsers(allUser);
      setIsLoading(false);
    };
    fetchData();
  }, [loggedInUserData?.token]);

  return (
    <View style={styles.container}>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={styles.formContainer}
      >
        <Text style={styles.formHeading}>Create New Goal</Text>
        <Text style={styles.titles}>Title</Text>
        <TextInput
          style={styles.inputStyle}
          maxLength={50}
          value={titleText}
          onChangeText={(text) => {
            setTitleText(text);
            setTitleError(''); // Clear error message on change
          }}
          placeholder="Enter title max of 50 characters."
          placeholderTextColor={StyleConfig.colors.placeholderText}
        />
        {titleError ? <Text style={styles.error}>{titleError}</Text> : null}

        <Text style={styles.titles}>Description</Text>
        <TextInput
          style={styles.inputStyle}
          value={descriptionText}
          onChangeText={(text) => {
            setDescriptionText(text);
            setDescriptionError(''); // Clear error message on change
          }}
          maxLength={200}
          placeholder="Enter max 200 characters."
          placeholderTextColor={StyleConfig.colors.placeholderText}
        />
        {descriptionError ? (
          <Text style={styles.error}>{descriptionError}</Text>
        ) : null}
        <View>
          <Text style={styles.titles}>Assign To: </Text>
          <TouchableOpacity
            testID="dropdown"
            style={[styles.dropDownSelector, styles.inputStyle]}
            onPress={selectDropDown}
          >
            <Text
              style={{
                color:
                  selectedUser === ''
                    ? StyleConfig.colors.placeholderText
                    : StyleConfig.colors.darkGrey,
              }}
            >
              {selectedUser === '' ? 'Select User' : selectedUser?.first_name}
            </Text>
            {!isDropDownSelected ? (
              <Image source={dropDownImage} style={styles.dropDownIcon} />
            ) : (
              <Image source={dropUpImage} style={styles.dropDownIcon} />
            )}
          </TouchableOpacity>
          {isDropDownSelected ? (
            <View testID="user-container" style={styles.dropDownArea}>
              <TextInput
                style={styles.searchBar}
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                maxLength={200}
                placeholder="Search User"
                placeholderTextColor={StyleConfig.colors.placeholderText}
              />
              {isLoading ? (
                <Text>Loading...</Text>
              ) : (
                <FlatList
                  nestedScrollEnabled
                  data={allUsers.filter(
                    (item) =>
                      item.first_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.last_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.github_id
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleDropDownPress(item)}
                        style={styles.userDetails}
                      >
                        {item.picture && item.picture.url ? (
                          <Image
                            source={{ uri: item.picture.url }}
                            style={styles.userImageDropDown}
                          />
                        ) : (
                          <View style={styles.defaultImageContainer}>
                            <Text style={styles.defaultImageText}>
                              {item.first_name.charAt(0)}{' '}
                              {item.last_name.charAt(0)}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.userNameDropDown}>
                          {item.first_name} {item.last_name}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>
          ) : null}
        </View>
        <Text style={styles.titles}>DeadLine</Text>
        <DeadLineDatePicker date={date} setDate={setDate} />
        <TouchableOpacity
          testID="createButton"
          style={styles.createButtonStyle}
          onPress={postNewGoal}
        >
          <Text style={styles.createButtonText}>Create Goal</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: scale(30),
    paddingHorizontal: scale(30),
    backgroundColor: 'white',
  },
  formHeading: {
    color: '#2827CC',
    fontSize: 25,
    fontWeight: 'bold',
  },
  inputStyle: {
    padding: scale(10),
    borderRadius: 8,
    backgroundColor: StyleConfig.colors.whiteInput,
    fontSize: scale(12),
    borderWidth: 0.5,
    color: StyleConfig.colors.darkGrey,
  },
  titles: {
    fontSize: scale(12),
    marginBottom: scale(4),
    marginTop: scale(20),
    color: StyleConfig.colors.greyLabel,
  },
  createButtonText: {
    fontSize: 15,
    color: 'white',
    alignSelf: 'center',
  },
  createButtonStyle: {
    padding: scale(14),
    marginTop: scale(25),
    borderRadius: 10,
    backgroundColor: '#2827CC',
  },
  titleText: {},
  dropDownSelector: {
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownIcon: {
    width: 20,
    height: 20,
  },
  dropDownArea: {
    height: scale(250),
    borderWidth: 0.5,
    marginTop: 10,
    borderRadius: 8,
  },
  userNameDropDown: {
    padding: 20,
    borderBottomColor: 'white',
    width: '90%',
    alignSelf: 'center',
    color: StyleConfig.colors.darkGrey,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
  },
  userImageDropDown: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  defaultImageContainer: {
    width: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: StyleConfig.colors.placeholderText,
    borderRadius: 50,
  },
  error: {
    color: 'red',
    fontSize: 10,
  },
  searchBar: {
    marginBottom: scale(20),
    marginHorizontal: 5,
    borderBottomWidth: 0.5,
    fontSize: scale(12),
    color: StyleConfig.colors.darkGrey,
  },
});

export default MainScreen;
