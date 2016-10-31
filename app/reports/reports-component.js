import h from 'react-hyperscript';
import R from 'ramda';
import moment from 'moment';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, VerticalBarSeries, MarkSeries } from 'react-vis';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

import Divider from 'material-ui/Divider';

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

      h(Row, {}, [
        h(Col, {xs: 12}, [
          regionGraph(R.head(R.values(reports))),
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

const spotReport = spot => {

  return (
    h(Card, {key: spot.id}, [
      h(CardHeader, {title: spotName(spot)} ),
      //h(CardText, {}, spotWind(spot)),
      h(CardTitle, {title: spotCondition(spot), subtitle: spotSurfRange(spot)}),
      h(CardText, {}, spotAirTemperature(spot)),
      h(CardText, {}, spotWaterTemperature(spot))
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

const regionGraph = spot => {
  const graphHeight = 120;

  //ugh
  //not sure why, but the XYPlot
  //isn't taking up space
  //so the paper doesn't have
  //a bottom margin
  const style = {
    height: graphHeight + 16
  };

  return h(Paper, {zDepth: 2}, [
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
