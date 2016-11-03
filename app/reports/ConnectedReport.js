import { connect } from 'react-redux';



import { reports } from './reports-component';

const mapStateToProps = state => {
  const {reports, browser, tides} = state;

  return {
    reports,
    tides,
    browser //TODO remove me
  };
};

let ConnectedReport = connect(mapStateToProps)(reports);

export default ConnectedReport;
