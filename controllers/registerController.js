// Controllers
const error = require('./errorController');

// route /register
module.exports = function (app, User, passport) {
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
};
