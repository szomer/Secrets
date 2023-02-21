// Modules
require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');

// Controllers
const loginController = require('./controllers/loginController');
const mongoController = require('./controllers/mongoController');
const secretsController = require('./controllers/secretsController');
const passportController = require('./controllers/passportController');

// Variables
const app = express();
const port = process.env.PORT || 3000;

// App set/use
app.set('view engine', 'ejs');
app.use('/assets', express.static(__dirname + '/public'));
app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // forces the session to be saved back to the session store
    saveUninitialized: false, // forces a session that is “uninitialized” to be saved to the store
    cookie: { secure: false },
  })
);
app.use(passport.initialize()); // init passport on every route call.
app.use(passport.session()); // allow passport to use "express-session".

// GET Home page
app.get('/', (req, res) => {
  res.render('home');
});

// database connection
mongoController
  .then((User) => {
    // passport controller
    passportController(app, passport, User);

    // api controllers
    loginController(app, User, passport);
    secretsController(app, User, passport);

    // Redirect when non-matching route
    app.all('*', function (req, res) {
      res.redirect('/');
    });

    // listen to port
    app.listen(port, () => {
      console.log(`Listening on port ${port}..`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
