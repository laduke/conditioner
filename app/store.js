import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { responsiveStoreEnhancer } from 'redux-responsive';




import reducers from './reducers';




let store = createStore(reducers,
  window.devToolsExtension && window.devToolsExtension(),
  compose(
    responsiveStoreEnhancer,
    applyMiddleware(thunkMiddleware)
  )
);

export default store;
