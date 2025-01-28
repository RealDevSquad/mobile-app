import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';

function ProgressModal() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [progress, setProgress] = useState(45); // Define the progress state

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleSliderChange = (value) => {
    const roundedValue = Math.round(value / 10) * 10;
    setProgress(roundedValue);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={toggleModal}>
        <CircularProgress
          value={progress}
          inActiveStrokeColor={'#58a07c'}
          inActiveStrokeOpacity={0.2}
          progressValueColor={'#fff'}
          strokeLinecap="round"
          activeStrokeColor="#6a6bcf"
          valueSuffix={'%'}
        />
      </TouchableOpacity>

      <Modal isVisible={isModalVisible} animationIn="bounceInDown">
        <View>
          <Card style={styles.cardContainer}>
            <Card.Content>
              <Title style={styles.titleText}>Update Your Task Progress</Title>
            </Card.Content>

            <Card.Content>
              <Paragraph> Assigning a task? Mark its progress as 0%.</Paragraph>
              <Paragraph> Task started? Update the progress to 10%.</Paragraph>
              <Paragraph>
                In the testing phase? Indicate a 40% completion.
              </Paragraph>
              <Paragraph>Under review? Progress should be at 70%.</Paragraph>
              <Paragraph>
                Moving to staging? Achieve a 95% completion rate.
              </Paragraph>
              <Paragraph>
                Task deployed to production? Reach the 100% milestone.
              </Paragraph>
            </Card.Content>
            <Card.Content>
              <Paragraph>Slide to update progress:</Paragraph>
              <Slider
                style={{ width: '80%', alignSelf: 'center' }}
                value={progress}
                onValueChange={handleSliderChange}
                minimumValue={0}
                maximumValue={100}
                step={10}
              />
              <Paragraph>Current Progress: {progress}%</Paragraph>
            </Card.Content>
            <Button style={styles.button} onPress={toggleModal}>
              Close
            </Button>
          </Card>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  paragraphText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#555',
    marginBottom: 10,
  },
  Modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    alignContent: 'center',
    margin: 37,
  },

  Button: {
    marginTop: 20,
    backgroundColor: '#6a6bcf',
    padding: 10,
    borderRadius: 8,
  },
});
export default ProgressModal;
