// Modules
const express = require('express');
const session = require('express-session');
// npm i passport passport-local passport-local-mongoose express-session
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Controllers
const loginController = require('./controllers/loginController');
const mongoController = require('./controllers/mongoController');
const registerController = require('./controllers/registerController');
const secretsController = require('./controllers/secretsController');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));
// This is the basic express session({..}) initialization.
app.use(
  session({
    secret: 'Our little secret.',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize()); // init passport on every route call.
app.use(passport.session()); // allow passport to use "express-session".

// database connection
mongoController
  .then((User) => {
    // passport
    passport.use(User.createStrategy());
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });

    // api controllers
    loginController(app, User, passport);
    registerController(app, User, passport);
    secretsController(app, User);
  })
  .catch((err) => {
    console.log(err);
  });

// Home page
app.get('/', (req, res) => {
  res.render('home');
});

// listen to port
app.listen(port, () => {
  console.log(`Listening on port ${port}..`);
});
