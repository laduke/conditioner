const bodyParser = require('body-parser');
const router = require('express').Router();



const report = require('./report-model')();

const get = (req, res) => {
  const spotID = req.params.spotID;

  report.spot(spotID)
    .then(data => res.status(200).json(data))
    .catch(err => console.log(err));
};

router.get('/:spotID', get);



module.exports = router;
