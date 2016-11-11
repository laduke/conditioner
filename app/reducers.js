import { applyMiddleware, combineReducers } from 'redux';
import {responsiveStateReducer} from 'redux-responsive';



import { reports, requesting } from './reports/reducer';
import { tides } from './tides/reducer';
import { geoLocation } from './travel-time/reducer';

let reducers = combineReducers({
  reports,
  tides,
  geoLocation,
  browser: responsiveStateReducer,
  requesting
});



export default reducers;
