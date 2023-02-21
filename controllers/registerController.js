// Modules
const bodyParser = require('body-parser');
// Controllers
const error = require('./errorController');

const urlencodedParser = bodyParser.urlencoded({ extended: true });

// route /register
module.exports = function (app, User, passport) {
  app
    .route('/register')

    // GET register
    .get((req, res) => {
      res.render('register');
    })

    // POST register
    .post(urlencodedParser, (req, res) => {
      User.register(
        { username: req.body.username },
        req.body.password,
        function (err, user) {
          if (err) {
            console.log(err);
            res.redirect('/register');
          } else {
            passport.authenticate('local')(req, res, function () {
              res.redirect('/');
            });
          }
        }
      );
    });
};
