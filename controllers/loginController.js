// Modules
const bodyParser = require('body-parser');
// Controllers
const errorController = require('./errorController');

const urlencodedParser = bodyParser.urlencoded({ extended: true });

// route /login
module.exports = function (app, User, passport) {
  app
    .route('/login')

    // GET Log In
    .get((req, res) => {
      res.render('login');
    })

    // POST Log In
    .post(urlencodedParser, (req, res) => {
      // User object
      const user = new User({
        username: req.body.username,
        password: req.body.password,
      });

      req.login(user, function (err) {
        if (err) {
          console.log(err);
        } else {
          passport.authenticate('local')(req, res, function () {
            res.redirect('/secrets');
          });
        }
      });
    });
};
