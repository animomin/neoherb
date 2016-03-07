var express = require('express');
var router = express.Router();

router.get('/zipcode', function(req, res, next){
  res.render('modals/zipcode');
});

router.get('/zipcode/v2', function(req, res, next){
  res.render('modals/zipcodev2', { body : 'gray-bg'});
});

module.exports = router;
