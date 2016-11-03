import R from 'ramda';
import moment from 'moment';

export const renameKeys = R.curry((keysMap, obj) => {
  return R.reduce((acc, key) => {
    acc[keysMap[key] || key] = obj[key];
    return acc;
  }, {}, R.keys(obj));
});

export const timeToMoment = R.curry(time => moment(time, 'MMM DD, YYYY HH:mm:ss'));
export const momentToHour = R.curry(m => m.hour());
export const momentToMinute = R.curry(m => m.format('mm'));

