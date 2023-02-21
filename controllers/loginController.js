// Controllers
const errorController = require('./errorController');

// route /login
module.exports = function (app, User, passport) {
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
};
