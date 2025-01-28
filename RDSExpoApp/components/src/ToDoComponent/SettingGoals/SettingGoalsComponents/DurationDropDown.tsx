import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
const timeperiod = [
  { names: 'Short term' },
  { names: 'Mid term' },
  { names: 'Long term' },
];

const windowWidth = Dimensions.get('window').width;
const durationButtonWidth = windowWidth - 150;

const DurationDropDown = () => {
  const [clicked, setClicked] = useState(false);
  const [data] = useState(timeperiod);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('');

  return (
    <View>
      <TouchableOpacity
        style={styles.DropDownButton}
        onPress={() => {
          setClicked(!clicked);
        }}
      >
        <Text style={styles.TimePeriod}>
          {selectedTimePeriod === '' ? 'Select duration' : selectedTimePeriod}
        </Text>
        {clicked ? (
          <Text style={styles.DropDownClose}>-</Text>
        ) : (
          <Text style={styles.DropDownOpen}>+</Text>
        )}
      </TouchableOpacity>
      {clicked ? (
        <SafeAreaView>
          <FlatList
            style={styles.DropDownMenu}
            data={data}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  style={styles.DropDownElement}
                  onPress={() => {
                    setSelectedTimePeriod(item.names);
                    setClicked(!clicked);
                  }}
                >
                  <Text style={styles.DropDownList}>{item.names}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  DropDownButton: {
    width: durationButtonWidth,
    height: 50,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 25,
    paddingRight: 25,
  },
  DropDownMenu: {
    elevation: 5,
    marginTop: 20,
    height: 100,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  DropDownElement: {
    width: '85%',
    alignSelf: 'center',
    height: 50,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
  },
  DropDownClose: {
    color: 'black',
    fontSize: 20,
  },
  DropDownOpen: {
    color: 'black',
    fontSize: 20,
  },
  DropDownList: {
    fontWeight: '600',
    color: 'black',
  },
  TimePeriod: {
    fontWeight: '600',
    color: 'black',
  },
});

export default DurationDropDown;
