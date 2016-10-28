import React from 'react';
import h from 'react-hyperscript';
import { Grid } from 'react-flexbox-grid/lib/index';



import ConnectedReport from './reports/ConnectedReport';

const App = () => {
  return (
  h(Grid, {}, [
    h(ConnectedReport)
  ])
  );
};




export default App;
