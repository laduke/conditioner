import { connect } from 'react-redux';



import { reports } from './reports-component';

const mapStateToProps = state => {
  const {reports, browser} = state;

  return {
    reports,
    browser
  };
};

let ConnectedReport = connect(mapStateToProps)(reports);

export default ConnectedReport;
