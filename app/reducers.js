import { applyMiddleware, combineReducers } from 'redux';



const helloReducer = (state = {}, action) => {

  switch (action.type) {
    default: {
      return state;
    }
  }
};

let reducers = combineReducers({
  helloReducer
});



export default reducers;
