import React from 'react';
import h from 'react-hyperscript';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';



import ConnectedReport from './reports/ConnectedReport';
import ConnectedTides from './tides/ConnectedTides';

const App = () => {
  return (
  h(Grid, {}, [
    h(Row, {}, [
      h(Col, {xs: 12}, [
        h('div', {style: {height: 10, backgroundColor: 'aqua'}})
      ])
    ]),
    h(ConnectedTides),
    h(ConnectedReport)
  ])
  );
};




export default App;
