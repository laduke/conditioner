import h from 'react-hyperscript';
import R from 'ramda';
import moment from 'moment';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Row, Col } from 'react-flexbox-grid/lib/index';


import { renameKeys, timeToMoment } from '../helpers';
import { tideGraph } from './tide-component';


export const reports = props => {
  const { reports, browser, tides } = props;


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
          h(Row, {}, [
            h(Col, {xs: 6}, [
              'Sunrise ',
              sunPointsTime(R.head(R.values(reports)), 'Sunrise')
            ]),
            h(Col, {xs: 6}, [
              'Sunset ',
              sunPointsTime(R.head(R.values(reports)), 'Sunset')
            ])
          ])
        ])
      ]),

      h(Row, {}, [
        // h(Col, {xs: 12}, [
        //   h('img', {src: 'https://cdip.ucsd.edu/recent/model_images/socal_now.png',
        //             width: graphWidth(browser)})
        // ]),
        h(Col, {xs: 12}, [
          h(List, {}, [
            R.values(R.map(spotReport, reports))
          ])
        ])
      ])

    ])

  ]);
};

const spotReport = spot => {
  //drop 0200 and 2300
  const wind = R.take(6, R.tail(windData(spot)));

  return h(ListItem, {
    key: spot.id,
    primaryText: spotName(spot),
    secondaryText: spotCondition(spot) + ' ' + spotSurfRange(spot),
    primaryTogglesNestedList: true,
    nestedItems: [
      h(ListItem, {
        key: 'wind'
      }, [
        h(Row, {}, [
          R.map(windColumn, wind )
        ])
      ]),
      h(ListItem, {
        key: 'temp',
        primaryText: spotAirTemperature(spot) + ' ' + spotWaterTemperature(spot)
      })
    ]
  });
};

const compass = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW','N'];

const sunPointsTime = ( spot, type  ) => {


  const sunPointsPath = R.pathOr([], ['Tide', 'SunPoints']);
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

  return h(Col, {key: wind.time, xs: 2}, [
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

const nameProp = R.prop('name');
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




