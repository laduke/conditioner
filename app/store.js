import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createResponsiveStoreEnhancer } from 'redux-responsive';




import reducers from './reducers';




let store = createStore(reducers,
  window.devToolsExtension && window.devToolsExtension(),
  compose(
    createResponsiveStoreEnhancer({performanceMode: true}),
    applyMiddleware(thunkMiddleware)
  )
);

export default store;
