import R from 'ramda';


import { RECEIVE_SPOT, REQUEST_SPOT } from './actions';

const reports = (state = {
    requesting: false
  }, action) => {

  switch (action.type) {
    case RECEIVE_SPOT: {
      const updateSpot = R.assoc(action.payload.id, action.payload);
      const requestDone = R.evolve({
        requesting: R.F
      });

      return R.compose(requestDone, updateSpot)(state);
    }
    case REQUEST_SPOT: {
      return R.evolve({
        requesting: R.T
      }, state);
    }
    default: {
      return state;
    }
  }

};

export default reports;
