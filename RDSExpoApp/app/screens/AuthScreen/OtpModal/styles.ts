import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  backdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: '#00000080',
  },
  centeredWrapper: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  relativeWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  textInputWrapper: {
    width: 0,
    height: 0,
  },
  textInput: {
    opacity: 1,
  },
  otpBoxesWrapper: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    zIndex: 10,
  },
  otpBox: {
    borderColor: '#e5e5e5',
    borderWidth: 2,
    borderRadius: 5,
    padding: 12,
    minWidth: 50,
  },
  otpBoxFocused: {
    color: '#000',
    backgroundColor: '#f2f0f0',
  },
  otp: {
    color: '#000',
    textAlign: 'center',
    fontSize: 20,
  },
  submitButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderColor: '#e5e5e5',
    borderWidth: 2,
    borderRadius: 20,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#04148455',
  },
  submitButtonActive: {
    backgroundColor: '#041484',
  },
  submitText: {
    fontSize: 20,
    color: '#fff',
  },
});
