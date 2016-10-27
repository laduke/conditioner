import { connect } from 'react-redux';
import h from 'react-hyperscript';
import R from 'ramda';



const report = props => {
  const {reports} = props;

  const firstKey = R.compose(R.head, R.keys)(reports);
  const firstSpot = R.prop(firstKey)(reports);

  const name = R.prop('name')(firstSpot);
  const condition = R.path(['Analysis', 'generalCondition'])(firstSpot);
  const waterTempMax = R.path(['WaterTemp', 'watertemp_max'])(firstSpot);
  const waterTempMin = R.path(['WaterTemp', 'watertemp_min'])(firstSpot);
  const surfRange = R.path(['Analysis', 'surfRange', 0])(firstSpot);
  const tempMax = R.path(['Weather', 'temp_max', 0])(firstSpot);
  const tempMin = R.path(['Weather', 'temp_min', 0])(firstSpot);

  console.log(firstSpot, surfRange);


  return (
    h('div', {}, [
      h('h1', {}, 'Southern Ca'),
      h('h2', {}, 'Spot: ' + name),
      h('p', {},  'Condition: ' + condition),
      h('p', {},  'Surf: ' + surfRange),
      h('p', {},  'Weather: ' + tempMin + '-' + tempMax),
      h('p', {},  'Water: ' + waterTempMin + '-' + waterTempMax)
    ])
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
