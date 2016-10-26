import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';




import reducers from './reducers';




let store = createStore(reducers,
  window.devToolsExtension && window.devToolsExtension(),
  applyMiddleware(thunkMiddleware)
);

export default store;
