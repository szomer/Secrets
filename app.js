// Modules
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');

// ENV
const url = process.env.MONGO_URL;
const port = process.env.PORT || 3000;

// Sass Compiler
// const sassCompiler = require('./services/sassCompiler');
// sassCompiler();

// Models
const userModel = require('./models/user');

// App
const app = express();
var router = express.Router();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/assets', express.static(__dirname + '/public'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

// User model
const User = userModel;

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
// strictQuery will become false in mongoose 7
mongoose.set('strictQuery', false);
// Connect db
mongoose.connect(url, options).then(() => {
  console.log('Database Connnected..');
});

// Routes
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
app.use('/', indexRouter);
app.use('/', authRouter);

app.get('*', (req, res) => {
  res.render('error');
});

// Listen on port
app.listen(port, () => {
  console.log(`Listening on port ${port}..`);
});

module.exports = router;
