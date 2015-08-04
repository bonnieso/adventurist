var express = require('express');
var mongoose = require('mongoose');
var User = require('../app/user');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.post('/users', function() {
  
})

router.get('/users', function() {
  User.findOne({ email: req.user.email }, function() {
    res.json(user);
  })
})

module.exports = router;
