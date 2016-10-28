import { applyMiddleware, combineReducers } from 'redux';



import { reports, requesting } from './reports/reducer';

let reducers = combineReducers({
  reports,
  requesting
});



export default reducers;
