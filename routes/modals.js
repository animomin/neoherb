var express = require('express');
var router = express.Router();

router.get('/zipcode', function(req, res, next){
  res.render('modals/zipcode');
});

module.exports = router;
