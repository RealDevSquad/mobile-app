import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.4,
  },
  btnView: {
    borderRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 60,
    minWidth: 200,
    width: '55%',
  },
  btnIcon: {
    flex: 0.2,
    justifyContent: 'center',
    paddingStart: 5,
  },
  signInTxtView: {
    flex: 0.8,
    justifyContent: 'center',
    paddingRight: 5,
  },
  signInText: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
