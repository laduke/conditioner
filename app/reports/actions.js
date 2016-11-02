import Future from 'fluture';

const apiSpotPath = spotID => `/api/reports/${spotID}`;

export const futureSpot = spotID => {
  return dispatch => {
    dispatch(requestSpot());
    return new Future ((reject, resolve) => {
      fetch(apiSpotPath(spotID))
        .then(res => (res.json()))
        .then(json => dispatch(receiveSpot(json)))
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  };
};

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
