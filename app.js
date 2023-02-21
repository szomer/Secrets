// Modules
// npm i passport passport-local passport-local-mongoose express-session
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const dotenv = require('dotenv').config();

// Controllers
const loginController = require('./controllers/loginController');
const mongoController = require('./controllers/mongoController');
const registerController = require('./controllers/registerController');
const secretsController = require('./controllers/secretsController');

const sessionSecret = process.env.SESSION_SECRET;
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(
  session({
    secret: sessionSecret,
    resave: false, // forces the session to be saved back to the session store
    saveUninitialized: false, // forces a session that is “uninitialized” to be saved to the store
    cookie: { secure: false },
  })
);
app.use(passport.initialize()); // init passport on every route call.
app.use(passport.session()); // allow passport to use "express-session".

// database connection
mongoController
  .then((User) => {
    // make passport use the local strategy
    passport.use(User.createStrategy());
    // serialize the user instance with the information we pass on to it
    // and store it in the session via a cookie
    passport.serializeUser(function (user, done) {
      done(null, user.id);
    });
    // will be invoked every subsequent request to deserialize the instance
    // providing it the unique cookie identifier as a “credential”
    passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });

    // api controllers
    loginController(app, User, passport);
    registerController(app, User, passport);
    secretsController(app, User, passport);
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
