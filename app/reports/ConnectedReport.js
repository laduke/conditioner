import { connect } from 'react-redux';
import h from 'react-hyperscript';
import R from 'ramda';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries, MarkSeries } from 'react-vis';
import moment from 'moment';

import { renameKeys } from '../helpers';
const nameProp = R.prop('name');

const timeToMoment = R.curry(time => moment(time, 'MMM DD, YYYY HH:mm:ss'));
const momentToHour = R.curry(m => m.hour());
const momentToMinute = R.curry(m => m.format('mm'));

const report = props => {
  const {reports} = props;


  return h('div', {}, [
    xyPlot(R.head(R.values(reports))),
    R.values(R.map(spotReport, reports))
  ]);
};

const spotReport = spot => {

  return ( h('div', {key: spot.id}, [
    spotName(spot),
    spotCondition(spot),
    spotSurfRange(spot),
    spotAirTemperature(spot),
    spotWaterTemperature(spot)
  ])
  );
};

const spotName = spot => {
  return h('h2', {}, nameProp(spot));
};
const spotCondition = spot => {
  const conditionPath = R.path(['Analysis', 'generalCondition']);

  return h('p', {}, 'Condition: ' + conditionPath(spot));
};
const spotSurfRange = spot => {
  const surfRangePath = R.path(['Analysis', 'surfRange', 0]);

  return h('p', {}, 'Surf: ' + surfRangePath(spot));
};
const spotAirTemperature = spot => {
  const tempMax = R.path(['Weather', 'temp_max', 0]);
  const tempMin = R.path(['Weather', 'temp_min', 0]);

  return h('p', {}, 'Weather: ' + tempMin(spot) + '-' + tempMax(spot));
};
const spotWaterTemperature = spot => {
  const waterTempMax = R.path(['WaterTemp', 'watertemp_max']);
  const waterTempMin = R.path(['WaterTemp', 'watertemp_min']);

  return h('p', {}, 'Water: ' + waterTempMin(spot) + '-' + waterTempMax(spot));
};

const xyPlot = spot => {

  return h(XYPlot, {
    width: 480,
    height: 120,
    animation: true
  }, [
    h(HorizontalGridLines),
    tidesElement(spot),
    sunPointsElement(spot),
    h(XAxis, {
      tickTotal: 24
    }),
    h(YAxis)
  ]);
};


const tidesElement = spot => {

  const rawTimeToHour = R.evolve({
    Rawtime: R.pipe(timeToMoment, momentToHour)
  });
  const tidesPath = R.pathOr([], ['Tide', 'dataPoints']);
  const tideProps = R.pickAll(['height', 'Rawtime']);

  const tides = R.pipe(
    tidesPath,
    R.take(30),
    R.map(tideProps),
    R.map(rawTimeToHour),
    R.map(renameKeys({
      height: 'y',
      Rawtime: 'x'
    })),
    R.reject(R.propEq('y', 0))
  );

  return h(VerticalBarSeries, {
    data: tides(spot),
    color: "teal"
  });
};

const sunPointsElement = spot => {

  const sunPointsPath = R.pathOr([], ['Tide', 'SunPoints']);
  const sunpointPropEq = R.propEq('type');

  const hourWithDecimalMinutes = R.curry(m => {
    return parseFloat(momentToHour(m) + '.' + 60 / momentToMinute(m));
  });

  const sunpointTime = type => {
    return R.pipe(
      sunPointsPath,
      R.filter(sunpointPropEq(type)),
      R.map(R.prop('Rawtime')),
      R.map(timeToMoment),
      R.map(hourWithDecimalMinutes)
    );
  };

  const sunrise = sunpointTime('Sunrise');
  const sunset = sunpointTime('Sunset');

  const sunrisePlot = R.defaultTo(0, R.head(sunrise(spot)));
  const sunsetPlot = R.defaultTo(0, R.head(sunset(spot)));

  return [
    h(MarkSeries, {
      key: 'rise',
      size: 10,
      data: [{
        y: 3,
        x: sunrisePlot
      }],
      opacity: 0.8,
      color: "red"
    }),
    h(MarkSeries, {
      key: 'set',
      size: 10,
      data: [{
        y: 3,
        x: sunsetPlot
      }],
      opacity: 0.8,
      color: "navy"
    })
  ];
};


const mapStateToProps = state => {
  const {reports} = state;

  return {
    reports
  };
};

let ConnectedReport = connect(mapStateToProps)(report);

export default ConnectedReport;
