import R from 'ramda';
import { getPosition } from 'redux-effects-geolocation';
import { fetchSpot } from '../reports/actions';

const locationToString = location => {
  if(location.latitude) {
    return  `${location.latitude},${location.longitude}`;
  } else if (location.lat){
    return  `${location.lat},${location.lon}`;
  }

  return null;
};

const fetchAllDistance = (dispatch, getState) => {
  const reports = getState().reports;
  const ids = R.compose(R.pluck('id'), R.values);

  const helper = id => {
    dispatch(fetchDistance(parseInt(id, 10)));
  };

  R.map(helper, ids(reports));
};


export function fetchDistance(spotID) {
  return ( dispatch, getState ) => {
    const origin = locationToString(getState().geoLocation);
    const destination = locationToString(getState().reports[spotID]);


    if(origin != null ) {
      dispatch(requestDistance());
      return fetch(`/api/distance/${origin}/${destination}`)
        .then(response => response.json())
        .then(json => dispatch(receiveDistance(json, spotID)))
        .catch(err => console.log(err));
    };
  };
}

export const REQUEST_DISTANCE = 'REQUEST_DISTANCE';
export const RECEIVE_DISTANCE = 'RECEIVE_DISTANCE';
export const REQUEST_LOCATION = 'REQUEST_LOCATION';
export const RECEIVE_LOCATION = 'RECEIVE_LOCATION';

export function fetchLocation() {
  return (dispatch, getState) => {
    dispatch(requestLocation());
    return dispatch(getPosition())
      .then(json => dispatch(receiveLocation(json)))
      .then(() => fetchAllDistance(dispatch, getState))
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
