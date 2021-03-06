import h from 'react-hyperscript';
import {Legend, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import R from 'ramda';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import moment from 'moment';


import { renameKeys, timeToMoment, momentToHour, momentToMinute } from '../helpers';

const tideGraph = ( spot, browser ) => {
  const width = graphWidth(browser);

  return h('div', {style:{margin: 'auto', width: width}}, [
    h('h2', 'Tides'),
    h(AreaChart, {width: width, height: 120, margin:{left: -40, top: 10, right: 30}, data: tideData(spot) }, [
      h(Area, {type: 'monotone', dataKey: 'Height', stroke: '#8884d8' }),
      h(CartesianGrid, {stroke: '#ccc'}),
      h(XAxis, {dataKey: 'Time'}),
      h(YAxis),
      h(Tooltip)
    ])
  ]);

};

const graphWidth = browser => {
  let width = 386;
  if(browser.greaterThan.extraSmall) width = 386;
  if(browser.greaterThan.small) width = 768;
  if(browser.greaterThan.medium) width = 992;
  if(browser.greaterThan.large) width = 1200;

  return width;
};

const rawTimeToHour = R.evolve({
  Rawtime: R.pipe(timeToMoment, momentToHour)
});

const tidesPath = R.pathOr([], [ 'dataPoints']);
const tideProps = R.pickAll(['height', 'Rawtime']);
const tooEarly = R.propSatisfies(time => time < 5, 'Time');
const tooLate = R.propSatisfies(time => time > 21, 'Time');

const tideData = R.pipe(
  tidesPath,
  R.take(30),
  R.map(tideProps),
  R.map(rawTimeToHour),
  R.reject(R.propEq('height', 0)),
  R.reject(R.propEq('height', 0)),
  R.map(renameKeys({
    Rawtime: 'Time',
    height: 'Height'
  })),
  R.reject(tooEarly),
  R.reject(tooLate)
);

const sunPointsTime = ( spot, type  ) => {


  const sunPointsPath = R.pathOr([], ['SunPoints']);
  const sunpointPropEq = R.propEq('type');


  const sunpointTime = type => {
    return R.pipe(
      sunPointsPath,
      R.filter(sunpointPropEq(type)),
      R.map(R.prop('Rawtime')),
      R.map(timeToMoment)
    );
  };

  const sunpoint = sunpointTime(type);

  const sunpoint_ = R.defaultTo(0, R.head(sunpoint(spot)));

  return moment(sunpoint_).format('HH:mm');

};

export const tides = props => {
  const { tides, browser } = props;

  return h(Row, {}, [
    h(Col, {xs: 12}, [
      tideGraph(R.head(R.values(tides)), browser),
      h(Row, {center: 'xs'}, [
        h(Col, {xs: 6}, [
          'Sunrise ',
          sunPointsTime(R.head(R.values(tides)), 'Sunrise')
        ]),
        h(Col, {xs: 6}, [
          'Sunset ',
          sunPointsTime(R.head(R.values(tides)), 'Sunset')
        ])
      ])
    ])
  ]);
};
