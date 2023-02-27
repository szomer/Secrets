var express = require('express');
var router = express.Router();

// get Home page
router.get('/', function (req, res, next) {
  res.render('index');
});

// get sign in page
router.get('/login', function (req, res, next) {
  res.render('login', { user: req.user });
});

// get sign in page
router.get('/register', function (req, res) {
  res.render('register', { msg: '' });
});

// get sign up page with error
router.get('/register/error', function (req, res, next) {
  res.render('register', {
    msg: 'An account with this username already exists.',
  });
});

module.exports = router;
