import h from 'react-hyperscript';
import R from 'ramda';
import moment from 'moment';
import {Legend, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
import Divider from 'material-ui/Divider';

import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import { renameKeys } from '../helpers';
const nameProp = R.prop('name');

const timeToMoment = R.curry(time => moment(time, 'MMM DD, YYYY HH:mm:ss'));
const momentToHour = R.curry(m => m.hour());
const momentToMinute = R.curry(m => m.format('mm'));

export const reports = props => {
  const { reports, browser } = props;


  return h(Row, {}, [
    h(Col, {xs: 12}, [

      h(Row, {center: 'xs'}, [
        h(Col, {xs: 12}, [
          h('div', {}, [
            h('h1', {}, 'Socal')
          ])
        ])
      ]),

      h(Row, {center: 'xs'}, [
        h(Col, {xs: 12}, [
          tideGraph(R.head(R.values(reports)), browser),
        ])
      ]),

      h(Row, {}, [
        h(Col, {xs: 12}, [
          R.values(R.map(spotReport, reports))
        ])
      ])

    ])

  ]);
};

const compass = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N'];

const windData = spot => {
  const windDates = R.pathOr([], ['Wind', 'dateStamp', 0])(spot);
  const windTimes = R.pathOr([], ['Wind', 'periodSchedule', 0])(spot);
  const windDirections = R.pathOr([], ['Wind', 'wind_direction', 0])(spot);
  const windSpeeds = R.pathOr([], ['Wind', 'wind_speed', 0])(spot);


  const fourArraysToObjects = (as, bs, cs, ds) =>{
    return R.reduce((acc, [date, time, speed, direction]) =>
                  R.append({date, time, speed, direction}, acc), [], R.transpose([as, bs, cs, ds]));
  };

  return fourArraysToObjects(windDates, windTimes, windSpeeds, windDirections);

};

const windColumn = wind => {
  const degreesToCompass = R.pipe(R.divide(R.__, 22.5),
                               R.add(0.5),
                               R.modulo(R.__, 16),
                               Math.floor,
                               R.nth(R.__, compass)
                              );


  const rotatedArrow = degrees => {
    const rotate = `rotate(${degrees - 180}deg)`;

    return {
      className: 'fa fa-long-arrow-up',
      style: {
        transform: rotate
      }
    };
  };

  const time = wind.time.slice(0,2) + ':' + wind.time.slice(2);

  return h(Col, {xs: 2}, [
    h('div', {}, time),
    h('div', {}, R.take(3, wind.speed + '') + 'kts'),
    h('div', {},[
      h('span', degreesToCompass(wind.direction)), 
      h('span', ' '),
      h('span', rotatedArrow(wind.direction))
    ]
     )
  ]);
};

const spotReport = spot => {
  //drop 0200 and 2300
  const wind = R.take(6, R.tail(windData(spot)));

  return (
    h('div', {key: spot.id}, [
      h(Divider),
      h(List, {}, [
        h('h2', spotName(spot) ),
        h(ListItem,{}, [
          h(Subheader, 'Wind' ),
          h(Row, {center: 'xs'}, 
            R.map(windColumn, wind )
           )
        ]),
        h(ListItem, {}, [
          h('span', {}, 'Conditions: ' ),
          h('span', {}, spotCondition(spot)),
          h('span', {}, ' '),
          h('span', {}, spotSurfRange(spot))
        ]),
        h(ListItem, {}, [
          h('span', {}, spotAirTemperature(spot)),
          h('span', {}, ' '),
          h('span', {}, spotWaterTemperature(spot))
        ])
      ])
    ])
  );
};

const spotName = spot => {
  return nameProp(spot);
};

const spotWind = spot => {
  return 'Wind goes here';
};
const spotCondition = spot => {
  const conditionPath = R.path(['Analysis', 'generalCondition']);

  return conditionPath(spot);
};
const spotSurfRange = spot => {
  const surfRangePath = R.path(['Analysis', 'surfRange', 0]);

  return surfRangePath(spot);
};
const spotAirTemperature = spot => {
  const tempMax = R.path(['Weather', 'temp_max', 0]);
  const tempMin = R.path(['Weather', 'temp_min', 0]);

  return 'Air: ' + tempMin(spot) + '-' + tempMax(spot);
};
const spotWaterTemperature = spot => {
  const waterTempMax = R.path(['WaterTemp', 'watertemp_max']);
  const waterTempMin = R.path(['WaterTemp', 'watertemp_min']);

  return 'Water: ' + waterTempMin(spot) + '-' + waterTempMax(spot);
};

const graphWidth = browser => {
  let width = 480;
  if(browser.greaterThan.extraSmall) width = 480;
  if(browser.greaterThan.small) width = 768;
  if(browser.greaterThan.medium) width = 992;
  if(browser.greaterThan.large) width = 1200;

  return width;
};

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

const rawTimeToHour = R.evolve({
  Rawtime: R.pipe(timeToMoment, momentToHour)
});
const tidesPath = R.pathOr([], ['Tide', 'dataPoints']);
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


