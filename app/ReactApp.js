import React from 'react';
import h from 'react-hyperscript';



import ConnectedReport from './reports/ConnectedReport';

const App = () => {
  return (
    h('div', {}, [
      h(ConnectedReport)
    ])
  );
};




export default App;
