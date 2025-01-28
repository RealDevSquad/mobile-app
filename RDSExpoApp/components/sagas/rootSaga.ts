import { all } from 'redux-saga/effects';
import watchUserRequestSaga from './handlers/user';

function* rootSaga() {
  yield all([watchUserRequestSaga()]);
}

export default rootSaga;
