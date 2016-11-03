import h from 'react-hyperscript';
import R from 'ramda';
import moment from 'moment';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import {limeA400, blue800, green500, purple800} from 'material-ui/styles/colors';
import ActionGrade from 'material-ui/svg-icons/action/grade';



import { renameKeys, timeToMoment } from '../helpers';


const sortByLatitude = R.sortBy(R.prop('lat'));

const sortReports = reports => {
  return sortByLatitude(reports);
};

export const reports = props => {
  const { reports, browser } = props;

  //reports comes in as an object with spot objects under each spotID key.
  //turn this into an array of spots and sort
  const spots = R.pipe(R.values, sortByLatitude, R.reverse);

  return h(Row, {}, [
    h(Col, {xs: 12}, [


      h(Row, {}, [
        // h(Col, {xs: 12}, [
        //   h('img', {src: 'https://cdip.ucsd.edu/recent/model_images/socal_now.png',
        //             width: graphWidth(browser)})
        // ]),
        h(Col, {xs: 12}, [
          h(List, {}, [
            R.map(spotReport, spots(reports))
          ])
        ])
      ])
    ])
  ]);
};

const conditionToColor =  {
  'good': limeA400,
  'fair': green500,
  'poor to fair': blue800,
  'poor': purple800
};

const spotReport = spot => {
  //drop 0200 and 2300
  const wind = R.take(6, R.tail(windData(spot)));

  return h(ListItem, {
    key: spot.id,
    primaryText: spotName(spot),
    leftIcon:  h(ActionGrade, {
      color: conditionToColor[spotCondition(spot)]
    }),
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




