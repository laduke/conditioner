import { applyMiddleware, combineReducers } from 'redux';
import {responsiveStateReducer} from 'redux-responsive';



import { reports, requesting } from './reports/reducer';
import { tides } from './tides/reducer';

let reducers = combineReducers({
  reports,
  tides,
  browser: responsiveStateReducer,
  requesting
});



export default reducers;
