import React from 'react';
import h from 'react-hyperscript';
import R from 'ramda';
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
import { fetchSpot, futureSpot } from './reports/actions.js';


const helper = R.curry((spotId, _) => dispatcher(spotId));

const dispatcher = R.curry((spotId) => {
  return store.dispatch(futureSpot(spotId));
});

const seq = R.pipe(
  R.chain(helper(53412)),
  R.chain(helper(4875)),
  R.chain(helper(4874)),
  R.chain(helper(4217)),
  R.chain(helper(4900)),
  R.chain(helper(4209))
)(dispatcher(4233));


seq.fork(
  error => console.error(error),
  data => console.log(data)
);


// store.dispatch(fetchSpot(4233));//salt creek
// store.dispatch(fetchSpot(53412));//blackies
// store.dispatch(fetchSpot(4875));//river jetties
// store.dispatch(fetchSpot(4874));//hb south
// store.dispatch(fetchSpot(4217));//seal
// store.dispatch(fetchSpot(4900));//porto
// store.dispatch(fetchSpot(4209));//malibu

ReactDOM.render(
  h(Provider, {
    store: store
  }, [
    h(AppContainer, {}, [
      h(MuiThemeProvider, {}, [
        h(App)
      ])
    ])
  ]),
  document.getElementById('root')
);


if (module.hot) {
  module.hot.accept('./ReactApp', () => {
    let App = require('./ReactApp').default;

    ReactDOM.render(
      h(AppContainer, {}, [
        h(Provider, {
          store: store
        }, [
          h(MuiThemeProvider, {}, [
            h(App)
          ])
        ])
      ]),
      document.getElementById('root')
    );


  });
}


