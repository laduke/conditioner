import h from 'react-hyperscript';
import R from 'ramda';
import moment from 'moment';
import {Legend, AreaChart, Area, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip} from 'recharts';
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
          tideGraph(R.head(R.values(reports))),
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

const tideGraph = spot => {

  return h(Paper, {zDepth: 2}, [
    h('h2', 'Tides'),
    h(AreaChart, {width: 600, height: 120, margin:{top: 10, right: 20}, data: tideData(spot) }, [
      h(Area, {type: 'monotone', dataKey: 'Height', stroke: '#8884d8' }),
      h(CartesianGrid, {stroke: '#ccc'}),
      h(XAxis, {dataKey: 'Time'}),
      h(YAxis),
      h(Tooltip),
      h(Legend )
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


