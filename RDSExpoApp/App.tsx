import createSagaMiddleware from '@redux-saga/core';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import Index from './app/index';
import { AuthProvider } from './components/context/AuthContext';
import reducers from './components/reducers';
import rootSaga from './components/sagas/rootSaga';


const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];
export const store = compose(applyMiddleware(...middleware))(createStore)(
  reducers,
);
sagaMiddleware.run(rootSaga);

const App = () => {
  return (
    <>
      <Provider store={store}>
        <AuthProvider>
          <Index />
        </AuthProvider>
      </Provider>
      <Toast />
    </>
  );
};

export default App;
