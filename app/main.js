import React from 'react';
import h from 'react-hyperscript';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';



require('./index.html');
require('./reports/style.scss');

import store from './store';
import App from './ReactApp';
import {fetchSpot} from './reports/actions.js';

store.dispatch(fetchSpot(4233));

ReactDOM.render(
  h(AppContainer, {}, [
    h(Provider, {store: store}, [
      h(App)
    ])
  ]),
  document.getElementById('root')
);


if(module.hot){
  module.hot.accept('./ReactApp', () => {
    let App = require('./ReactApp').default;

    ReactDOM.render(
      h(AppContainer, {}, [
        h(Provider, {store: store}, [
          h(App)
        ])
      ]),
      document.getElementById('root')
    );


  });
}


