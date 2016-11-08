
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
