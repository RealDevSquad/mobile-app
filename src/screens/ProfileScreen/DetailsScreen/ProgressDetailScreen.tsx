import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

const ProgressDetailScreen = () => {
  // TODO: progress detail api call

  const [taskCompleted, setTaskCompleted] = useState('');
  const [taskPlanned, setTaskPlanned] = useState('');
  const [taskBlockers, setTaskBlockers] = useState('');

  return (
    <ScrollView style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Task Detail</Text>
      </View>
      <View style={styles.progressUpdateBackground}>
        <Text style={styles.progressText}>
          You have {<Text style={styles.missedProgressCount}>0 missed </Text>}
          Progress updates{'\n'}
        </Text>
        <Text style={styles.progressText}>
          Let us try not to miss giving updates
        </Text>
      </View>
      <Text style={styles.taskUpdateTitle}>Task Updates</Text>

      <Text style={styles.taskUpdateQuestion}>
        Task Progress after the previous update
      </Text>
      <TextInput
        style={styles.taskUpdateInput}
        multiline={true}
        onChangeText={(newText) => {
          setTaskCompleted(newText.trim());
        }}
        defaultValue={taskCompleted}
      />

      <Text style={styles.taskUpdateQuestion}>
        Planned progress before the next update
      </Text>
      <TextInput
        style={styles.taskUpdateInput}
        multiline={true}
        onChangeText={(newText) => {
          setTaskPlanned(newText.trim());
        }}
        defaultValue={taskPlanned}
      />

      <Text style={styles.taskUpdateQuestion}>
        List down any blockers that you have
      </Text>
      <TextInput
        style={styles.taskUpdateInput}
        multiline={true}
        onChangeText={(newText) => {
          setTaskBlockers(newText.trim());
        }}
        defaultValue={taskBlockers}
      />

      <TouchableOpacity style={styles.submitProgressContainer}>
        <Text style={styles.updatebutton}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProgressDetailScreen;

const styles = StyleSheet.create({
  mainview: {
    flex: 1,
    paddingTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  titleContainer: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  titleText: {
    color: '#041187',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subTitleText: {
    fontSize: 16,
    paddingBottom: 10,
    color: 'black',
  },
  smallTitle: {
    paddingBottom: 10,
    color: 'black',
    fontWeight: '600',
    paddingVertical: 5,
  },
  imageView: {
    alignItems: 'center',
  },
  taskUpdateTitle: {
    marginTop: 18,
    color: '#041187',
    fontSize: 20,
    fontWeight: '800',
  },
  taskUpdateDateTitle: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
  },
  taskUpdateQuestion: {
    marginTop: 16,
    color: '#616161',
    fontSize: 16,
  },
  taskUpdateInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  progressUpdateBackground: {
    borderRadius: 8,
    backgroundColor: '#1C315E',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  progressListLeftPadding: {
    marginLeft: 5,
  },
  updateButtonContainer: {
    backgroundColor: '#0034a5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '45%',
    borderRadius: 10,
  },
  updatebutton: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '800',
  },
  missedProgressCount: {
    color: 'red',
    fontWeight: '700',
    fontSize: 18,
    textDecorationLine: 'underline',
  },
  submitProgressContainer: {
    backgroundColor: '#0034a5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: '30%',
    borderRadius: 10,
    marginTop: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    marginHorizontal: 24,
    marginVertical: 8,
  },
  cardBackground: {
    backgroundColor: 'white',
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
    borderColor: '#F0F0F0',
    borderRadius: 8,
  },
  flexItemWidth: {
    width: '50%',
  },
  modalViewOld: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalView: {
    position: 'absolute',
    width: '100%',
    height: '8%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderWidth: 1,
    borderColor: 'black',
  },
  buttonOpen: {
    backgroundColor: '#E20062',
  },
  buttonClose: {
    backgroundColor: '#1D1283',
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
  },
  icon: {
    backgroundColor: '#ccc',
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  logoutButton: {
    paddingHorizontal: 5,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 2,
    top: 10,
    backgroundColor: '#E20062',
    alignSelf: 'flex-end',
    margin: 5,
    width: '20%',
    textAlign: 'center',
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  DropDownElement: {
    color: 'black',
    width: '100%',
    alignSelf: 'center',
    height: 'auto',
  },
  DropDownbackground: {
    padding: 5,
    height: 'auto',
    alignSelf: 'center',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
});
