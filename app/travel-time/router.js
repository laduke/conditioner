const bodyParser = require('body-parser');
const router = require('express').Router();
const cache = require('apicache').middleware;
const distance = require('google-distance');
var config = require('../config');



distance.apiKey = config.googleMaps;



const get = (req, res) => {
  const origin = req.params.origin;
  const destination = req.params.destination;

  distance.get(
    {
      origin: origin,
      destination: destination,
      mode: 'driving',
      units: 'imperial'
    },
    function(err, data) {
      if (err) {
      } else {
        res.status(200).json(data);
      }
    });

};

router.get('/:origin/:destination', cache('1 hour'), get);



module.exports = router;
