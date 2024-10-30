import { jest } from '@jest/globals';
import mockRNDeviceInfo from 'react-native-device-info/jest/react-native-device-info-mock';

require('react-native-reanimated/src/jestUtils').setUpTests();
jest.mock('react-native-device-info', () => mockRNDeviceInfo);
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
