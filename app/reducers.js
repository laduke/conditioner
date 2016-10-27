import { applyMiddleware, combineReducers } from 'redux';



import reports from './reports/reducer';

let reducers = combineReducers({
  reports
});



export default reducers;
