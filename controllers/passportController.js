// Modules
require('dotenv').config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

module.exports = function (app, passport, User) {
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

  // Google OAuth
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/secrets',
        userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
      },
      function (accessToken, refreshToken, profile, cb) {
        // response of google auth

        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });
      }
    )
  );
  app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile'] })
  );
  app.get(
    '/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/secrets');
    }
  );
};
