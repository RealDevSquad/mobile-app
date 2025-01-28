import { StyleSheet } from 'react-native';
import { scale } from '../../../utils/utils';

export const TodoStyles = StyleSheet.create({
  container: {
    // padding: 10,
    // paddingBottom: 45,
    // borderBottomWidth: 3, TODO: will need in v2
    // borderBottomColor: '#b9c0c9',
    // borderBottomStartRadius: 20,
    // borderBottomEndRadius: 20,
    // zIndex: 1,
    flex: 1,
    paddingTop: scale(30),
    paddingHorizontal: scale(30),
    backgroundColor: 'white',
  },
  shodowcard: {
    width: '80%',
    paddingVertical: 30,
    borderWidth: 4,
    borderColor: '#cfcbc2',
    borderRadius: 10,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    zIndex: -1,
  },
  title: {
    fontSize: 25,
    color: '#492ed1',
    fontWeight: 'bold',
  },
  taskNotFound: {
    fontSize: 20,
    alignSelf: 'center',
    position: 'relative',
    color: '#000000',
    top: 10,
  },
  flex: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
