// Controllers
const errorController = require('./errorController');

// route /login, /register, /logout
module.exports = function (app, User, passport) {
  //-----------LOGIN------------
  app
    .route('/login')
    // GET Log In page
    .get((req, res) => {
      res.render('login');
    })
    // POST log in user
    .post(
      passport.authenticate('local', { failureRedirect: '/login' }),
      function (req, res) {
        const user = new User({
          username: req.body.username,
          password: req.body.password,
        });

        // Log in user
        req.login(user, function (err) {
          if (err) {
            next(err);
          }
          res.render('secrets');
        });
      }
    );

  //-----------REGISTER------------
  app
    .route('/register')
    // GET register page
    .get((req, res) => {
      res.render('register');
    })
    // POST register user
    .post((req, res) => {
      // register user
      User.register(
        { username: req.body.username },
        req.body.password,
        function (err, user) {
          if (err) {
            console.log(err);
            res.redirect('/register');
          } else {
            // authentication
            passport.authenticate('local')(req, res, function (err) {
              if (err) {
                console.log(err);
                res.redirect('/register');
              } else {
                res.redirect('/secrets');
              }
            });
          }
        }
      );
    });

  //-----------LOGOUT------------
  app.get('/logout', function (req, res) {
    // Log out the user
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });
};
