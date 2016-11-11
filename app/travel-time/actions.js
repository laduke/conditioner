import { getPosition } from 'redux-effects-geolocation';

export function fetchDistance(origin, destination, spotId) {
  return dispatch => {
    dispatch(requestDistance());
    return fetch(`/api/distance/${origin}/${destination}`)
      .then(response => response.json())
      .then(json => dispatch(receiveDistance(json, spotId)))
      .catch(err => console.log(err));
  };
}

export const REQUEST_DISTANCE = 'REQUEST_DISTANCE';
export const RECEIVE_DISTANCE = 'RECEIVE_DISTANCE';
export const REQUEST_LOCATION = 'REQUEST_LOCATION';
export const RECEIVE_LOCATION = 'RECEIVE_LOCATION';

export function fetchLocation() {
  return dispatch => {
    dispatch(requestLocation());
    return dispatch(getPosition())
      .then(json => dispatch(receiveLocation(json)))
      .catch(err => console.log(err));
  };
}

export const requestDistance = () => {
  return {
    type: REQUEST_DISTANCE
  };
};

function receiveDistance(json, spotId) {
  return {
    type: RECEIVE_DISTANCE,
    payload: {json: json, spotId: spotId}
  };
}

export const requestLocation = () => {
  return {
    type: REQUEST_LOCATION
  };
};

function receiveLocation(json) {
  return {
    type: RECEIVE_LOCATION,
    payload: json
  };
}
