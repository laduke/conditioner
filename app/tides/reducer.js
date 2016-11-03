import R from 'ramda';


import { RECEIVE_SPOT, REQUEST_SPOT } from '../reports/actions';

export const tides = (state = {}, action) => {

  switch (action.type) {
  case RECEIVE_SPOT: {

    const updateTide = R.assoc(action.payload.id, action.payload.Tide);

    return updateTide(state);
  }
  default: {
    return state;
  }
  }

};
