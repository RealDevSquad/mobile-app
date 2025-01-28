import { combineReducers } from 'redux';
import user from './user.reducer';
import localFeatureFlag from './featureFlag.reducer';

const reducers = combineReducers({ user, localFeatureFlag });

export default reducers;
