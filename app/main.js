import React from 'react';
import h from 'react-hyperscript';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();



require('./index.html');
require('./reports/style.scss');

import store from './store';
import App from './ReactApp';
import {fetchSpot} from './reports/actions.js';

store.dispatch(fetchSpot(4233));
store.dispatch(fetchSpot(4874));

ReactDOM.render(
  h(AppContainer, {}, [
    h(MuiThemeProvider, {}, [
      h(Provider, {store: store}, [
        h(App)
      ])
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


