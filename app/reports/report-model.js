const request = require('request-promise');



const URI = 'http://api.surfline.com/v1/forecasts/';

const surfline = () => {

  const spot = (spotId, cb) => {
    let options = {
      uri: URI + spotId + '?days=1',
      json: true
    };

    return request(options);
  };

  return {
    spot
  };

};



module.exports = surfline;
