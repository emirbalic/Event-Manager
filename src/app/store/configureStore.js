import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from '../reducers/rootReducer';
import thunk from 'redux-thunk';

export const configureStore = () => {
  const middlewares = [thunk];

  // in order to add thunk and still add devtools to store...
  const composedEnhancer = composeWithDevTools(applyMiddleware(...middlewares));

  const store = createStore(rootReducer, composedEnhancer);

  return store;
};
