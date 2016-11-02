import { applyMiddleware, combineReducers } from 'redux';
import {responsiveStateReducer} from 'redux-responsive';



import { reports, requesting, tides } from './reports/reducer';

let reducers = combineReducers({
  reports,
  tides,
  browser: responsiveStateReducer,
  requesting
});



export default reducers;
