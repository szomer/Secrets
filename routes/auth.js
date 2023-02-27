var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
const connectEnsureLogin = require('connect-ensure-login');

// verify login user
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/secrets',
    failureRedirect: '/login',
  })
);

// register new user
router.post('/register', (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (!err) {
        passport.authenticate('local')(req, res, function () {
          console.log('New account created..');
          res.redirect('/secrets');
        });
      } else {
        res.redirect('register/error');
      }
    }
  );
});

// verify user for secrets
router.get('/secrets', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  User.find({ secret: { $ne: null } })
    .then((results) => {
      if (results) {
        var formattedUsername = '';
        if (req.user.username) {
          formattedUsername = ', ' + capitalizeFirstLetter(req.user.username);
        }
        res.render('secrets', {
          username: formattedUsername,
          secrets: results,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// logout user
router.get('/logout', function (req, res) {
  req.logout((err) => {
    if (err) {
      res.redirect('/secrets');
    } else {
      res.redirect('/');
    }
  });
});

// verify user for secrets
router.get('/submit', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.render('submit');
});

router.post('/submit', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const newSecret = req.body.secret;

  User.findById(req.user.id)
    .then((foundUser) => {
      if (foundUser) {
        foundUser.secret = newSecret;
        foundUser.save(function () {
          res.redirect('/secrets');
        });
      } else {
        res.redirect('/secrets');
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/secrets');
    });
});

module.exports = router;

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
