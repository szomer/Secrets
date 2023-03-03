var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Secret = require('../models/secret');
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
  Secret.find({ secret: { $ne: null } })
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

// User specific secrets
router.get('/mysecrets', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  // find user
  User.findById(req.user.id)
    .then((foundUser) => {
      // if found
      if (foundUser) {
        // render the secrets page with the user secrets
        res.render('mysecrets', {
          secrets: foundUser.secrets,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

// delete a secret
router.post(
  '/mysecrets/delete',
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    // Delete from secrets collection
    const deleted = await Secret.deleteOne({ _id: req.body.id });
    if (deleted.deletedCount === 1) {
      console.log('Secret deleted form secrets...');

      // Delete from users collection
      await User.findOneAndUpdate(
        { _id: req.user.id },
        { $pull: { secrets: { _id: req.body.id } } },
        { safe: true, multi: false }
      ).then(() => {
        console.log('Secret deleted form users...');
        // Redirect
        res.redirect('/secrets');
      });
    }
  }
);

// update a secret
router.post(
  '/mysecrets/update',
  connectEnsureLogin.ensureLoggedIn(),
  async (req, res) => {
    console.log(req.body.content, req.user.id);

    // Update secrets collection
    Secret.findOneAndUpdate(
      { _id: req.body.id },
      { secret: req.body.content }
    ).then(() => {
      console.log('Secret updated from secrets...');

      // Update users collection
      User.findOneAndUpdate(
        { _id: req.user.id },
        { secrets: [{ secret: req.body.content }] }
      ).then(() => {
        console.log('Secret updated from users...');
        res.redirect('/mysecrets');
      });
    });
  }
);

router.post(
  '/mysecrets/update',
  connectEnsureLogin.ensureLoggedIn(),
  (req, res) => {
    const updateSecretId = req.body.id;
    console.log(updateSecretId);
  }
);

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

// submit secret
router.post('/submit', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  const submittedSecret = req.body.secret;
  // Look up user
  User.findById(req.user.id)
    .then((foundUser) => {
      if (foundUser) {
        // Create new secret and add to secrets collection
        const newSecret = new Secret({ secret: submittedSecret });
        newSecret.save(() => {
          // Save the secret to the user
          foundUser.secrets.push(newSecret);
          foundUser.save(function () {
            res.redirect('/secrets');
          });
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
