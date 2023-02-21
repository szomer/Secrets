module.exports = function (app, User) {
  // GET secrets
  app.get('/secrets', (req, res) => {
    var showLogInButton = false;
    if (req.isAuthenticated()) {
      showLogInButton = true;
    }

    // get all secrets from db
    User.find({ secret: { $ne: null } })
      .then((results) => {
        if (results) {
          res.render('secrets', {
            usersWithSecrets: results,
            loggedIn: showLogInButton,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });

  app.get('/submit', (req, res) => {
    res.set(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      res.render('submit');
    } else {
      res.redirect('/');
    }
  });

  app.post('/submit', (req, res) => {
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      const newSecret = req.body.secret;

      User.findById(req.user.id)
        .then((foundUser) => {
          if (foundUser) {
            foundUser.secret = newSecret;
            foundUser.save(function () {
              res.redirect('/secrets');
            });
          } else {
            res.redirect('/');
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/submit');
        });
    } else {
      res.redirect('/');
    }
  });
};
