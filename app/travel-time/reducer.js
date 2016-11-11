import R from 'ramda';


import { RECEIVE_LOCATION, REQUEST_LOCATION } from './actions';

const updateLocation = R.pick(['latitude', 'longitude']);

export const geoLocation = (state = {}, action) => {
  switch (action.type) {
    case RECEIVE_LOCATION: {

      return updateLocation(action.payload.coords);
    }
    default: {
      return state;
    }
  }

};
