const bodyParser = require('body-parser');
const router = require('express').Router();
const cache = require('apicache').middleware;




const report = require('./report-model')();

const get = (req, res) => {
  const spotID = req.params.spotID;

  report.spot(spotID)
    .then(data => res.status(200).json(data))
    .catch(err => console.log(err));
};

router.get('/:spotID', cache('1 hour'), get);



module.exports = router;
