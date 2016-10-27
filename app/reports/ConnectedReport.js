import { connect } from 'react-redux';
import h from 'react-hyperscript';
import R from 'ramda';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries, MarkSeries } from 'react-vis';
import moment from 'moment';

import { renameKeys } from '../helpers';

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

  const toHour = R.curry(time => moment(time, 'MMM DD, YYYY HH:mm:ss').hour());
  const rawTimeToHour = R.evolve({
    Rawtime: toHour
  });

  const toMoment = R.curry(time => moment(time, 'MMM DD, YYYY HH:mm:ss'));


  const tidesPath = R.pathOr([], ['Tide', 'dataPoints']);
  const tideProps = R.pickAll(['height', 'Rawtime']);

  const sunPointsPath = R.pathOr([], ['Tide', 'SunPoints']);
  const sunpointPropEq = R.propEq('type');

  const sunpoint = type => {
    return R.pipe(sunPointsPath,
      R.filter(sunpointPropEq(type)),
      R.map(R.prop('Rawtime')),
      R.map(toMoment),
    );
  };

  const sunrise = sunpoint('Sunrise');
  const sunset = sunpoint('Sunset');

  const toHour2 = R.curry(m => m.format('HH'));
  const toMinute = R.curry(m => m.format('mm'));

  const toFraction = R.curry(m => {
    return parseFloat(toHour2(m) + '.' + 60 / toMinute(m));
  });



  const tides = R.pipe(
    tidesPath,
    R.map(tideProps),
    R.map(rawTimeToHour),
    R.map(renameKeys({
      height: 'y',
      Rawtime: 'x'
    })),
    R.reject(R.propEq('y', 0))
  );

  let sunrisePlot = R.defaultTo('', R.head(R.map(toFraction, sunrise(firstSpot))));
  let sunsetPlot = R.defaultTo('', R.head(R.map(toFraction, sunset(firstSpot))));

  console.log(sunrisePlot);



  return (
  h('div', {}, [
    h('h1', {}, 'Southern Ca'),


    h('h3', {}, 'Tides'),
    h(XYPlot, {
      width: 480,
      height: 120,
      animation: true
    }, [
      h(HorizontalGridLines),
      h(VerticalBarSeries, {
        data: tides(firstSpot)
      }),
      h(MarkSeries, {
        data: [{
          y: 5,
          x: 11
        }],
        size: 13,
        opacity: 0.8,
        color: "red"
      }),
      h(MarkSeries, {
        data: [{
          y: 5,
          x: 11
        }],
        size: 13,
        opacity: 0.5,
        color: "navy"
      }),
      h(XAxis),
      h(YAxis)
    ]),

    h('h2', {}, 'Spot: ' + name),
    h('p', {}, 'Condition: ' + condition),
    h('p', {}, 'Surf: ' + surfRange),
    h('p', {}, 'Weather: ' + tempMin + '-' + tempMax),
    h('p', {}, 'Water: ' + waterTempMin + '-' + waterTempMax),


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
