import { connect } from 'react-redux';
import h from 'react-hyperscript';



const report = props => {
  const {reports} = props;

  const first = Object.keys(reports)[0];

  if (first) {
    name = reports[first].name;
  }

  return (
  h('h2', {}, 'Spot: ' + name)
  );
};

const mapStateToProps = state => {
  const {reports} = state;

  return {
    reports
  };
};

let ConnectedReport = connect(mapStateToProps)(report);

export default ConnectedReport;
