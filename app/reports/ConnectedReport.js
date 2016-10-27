import { connect } from 'react-redux';
import h from 'react-hyperscript';
import R from 'ramda';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, MarkSeries } from 'react-vis';
import moment from 'moment';

const renameKeys = R.curry((keysMap, obj) => {
  return R.reduce((acc, key) => {
    acc[keysMap[key] || key] = obj[key];
    return acc;
  }, {}, R.keys(obj));
});

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

  const tidesPath = R.pathOr([], ['Tide', 'dataPoints']);
  const tideProps = R.pickAll(['height', 'Rawtime']);


  //Rawtime: "October 27, 2016 13:00:00"
  //Localtime: "2016-10-27 12:00:00"
  const momentToHour = R.curry(time =>  moment(time, 'MMM DD, YYYY HH:mm:ss').hour() );
  const rawTimeToHour = R.evolve({Rawtime: momentToHour});


  const tides = R.pipe(
    tidesPath,
    R.map(tideProps),
    R.map(rawTimeToHour),
    R.map(renameKeys({height: 'y', Rawtime: 'x'})),
    R.reject(R.propEq('y', 0))
  );

  let tmp = tides(firstSpot);
  console.log( tmp );



  return (
  h('div', {}, [
    h('h1', {}, 'Southern Ca'),
    h('h2', {}, 'Spot: ' + name),
    h('p', {}, 'Condition: ' + condition),
    h('p', {}, 'Surf: ' + surfRange),
    h('p', {}, 'Weather: ' + tempMin + '-' + tempMax),
    h('p', {}, 'Water: ' + waterTempMin + '-' + waterTempMax),

    h(XYPlot, {
      width: 480,
      height: 240
    }, [
      h(HorizontalGridLines),
      h(MarkSeries, {
        data: tides(firstSpot)
      },
      ),
      h(XAxis),
      h(YAxis)
    ])

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
