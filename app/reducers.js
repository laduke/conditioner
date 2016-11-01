import { applyMiddleware, combineReducers } from 'redux';
import {responsiveStateReducer} from 'redux-responsive';



import { reports, requesting } from './reports/reducer';

let reducers = combineReducers({
  reports,
  browser: responsiveStateReducer,
  requesting
});



export default reducers;
