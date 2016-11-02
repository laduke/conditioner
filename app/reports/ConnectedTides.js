import { connect } from 'react-redux';



import { tides } from './tide-component';

const mapStateToProps = state => {
  const {browser, tides} = state;

  return {
    tides,
    browser
  };
};

let ConnectedTides = connect(mapStateToProps)(tides);

export default ConnectedTides;
