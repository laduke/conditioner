export function fetchSpot(spotID) {
  return dispatch => {
    dispatch(requestSpot());
    return fetch(`/api/reports/${spotID}`)
      .then(response => response.json())
      .then(json => dispatch(receiveSpot(json)))
      .catch(err => console.log(err));
  };
}

export const REQUEST_SPOT = 'REQUEST_SPOT';
export const RECEIVE_SPOT = 'RECEIVE_SPOT';

export const requestSpot = () => {
  return {
    type: REQUEST_SPOT
  };
};

function receiveSpot(json) {
  return {
    type: RECEIVE_SPOT,
    payload: json
  };
}
