import R from 'ramda';


import { RECEIVE_SPOT, REQUEST_SPOT } from './actions';

export const reports = (state = {}, action) => {

  switch (action.type) {
    case RECEIVE_SPOT: {
      const updateSpot = R.assoc(action.payload.id, action.payload);

      return updateSpot(state);
    }
    default: {
      return state;
    }
  }

};

export const requesting = (state = false, action) => {
  switch (action.type) {
  case RECEIVE_SPOT: {
    return false;
  }
  case REQUEST_SPOT: {
    return true;
  }
  default: {
    return state;
  }
  }
};

