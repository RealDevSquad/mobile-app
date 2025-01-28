import { call, put, takeEvery } from 'redux-saga/effects';
import { User } from '../../context/type';
import { fetchUserData } from '../requests/fetchUser';

export function* fetchUserRequest(action) {
  try {
    const user: User = yield call(fetchUserData, action.payload);
    yield put({ type: 'FETCH_USER', user: user });
  } catch (error: any) {
    yield put({ type: 'FETCH_USER_ERROR', message: error.message });
  }
}

function* watchUserRequestSaga() {
  yield takeEvery('GET_USER', fetchUserRequest);
}

export default watchUserRequestSaga;
