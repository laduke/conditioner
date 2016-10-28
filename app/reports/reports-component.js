import h from 'react-hyperscript';
import R from 'ramda';
import moment from 'moment';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries, MarkSeries } from 'react-vis';
import Paper from 'material-ui/Paper';
import {Card} from 'material-ui/Card';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import { renameKeys } from '../helpers';
const nameProp = R.prop('name');

const timeToMoment = R.curry(time => moment(time, 'MMM DD, YYYY HH:mm:ss'));
const momentToHour = R.curry(m => m.hour());
const momentToMinute = R.curry(m => m.format('mm'));

export const reports = props => {
  const { reports } = props;


  return h(Row, {}, [
    h(Col, {xs: 12}, [
      regionGraph(R.head(R.values(reports))),
      //h(Row, {}, h(Col, {xs: 12}, h('div',{}, '.'))),
      R.values(R.map(spotReport, reports))
    ])
  ]);
};

const spotReport = spot => {

  return ( h(Row, {key: spot.id}, [
    h(Col, {xs: 12}, [
      h(Paper, {}, [
        spotName(spot),
        spotWind(spot),
        spotSurfRange(spot),
        spotAirTemperature(spot),
        spotWaterTemperature(spot)
      ])
    ])
  ])
  );
};

const spotName = spot => {
  return h(Row, {center: 'xs'}, [
    h(Col, {xs: 12}, [
      h('span', {}, nameProp(spot))
    ])
  ]);
};

const spotWind = spot => {
  return h(Row, {center: 'xs'}, [
    h(Col, {xs: 12}, [
      h('h2', {}, 'Wind goes here')
    ])
  ]);
};
const spotSurfRange = spot => {
  const surfRangePath = R.path(['Analysis', 'surfRange', 0]);
  const conditionPath = R.path(['Analysis', 'generalCondition']);

  return h(Row, {}, [
    h(Col, {xs: 6}, [
      h('p', {}, 'Surf: ' + surfRangePath(spot))
    ]),
    h(Col, {xs: 6}, [
      h('p', {}, 'Condition: ' + conditionPath(spot))
    ])
  ]);
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

const regionGraph = spot => {
  const graphHeight = 120;

  //ugh
  //not sure why, but the XYPlot
  //isn't taking up space
  //so the paper doesn't have
  //a bottom margin
  const style = {
    height: graphHeight + 18
  };

  return h(Row, {}, [
    h(Col, {xs: 12}, [
      h('div', {style: style}, [
        h(Paper, {}, [
          h(XYPlot, {
            width: 360,
            height: graphHeight,
            animation: true
          }, [
            h(HorizontalGridLines),
            tidesElement(spot),
            sunPointsElement(spot),
            h(XAxis, {
              tickTotal: 24
            }),
            h(YAxis)
          ])
        ])
      ])
    ])
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
