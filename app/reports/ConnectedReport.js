import { connect } from 'react-redux';



import { reports } from './reports-component';

const mapStateToProps = state => {
  const {reports} = state;

  return {
    reports
  };
};

let ConnectedReport = connect(mapStateToProps)(reports);

export default ConnectedReport;
