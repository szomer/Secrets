module.exports = function (app, User) {
  // GET logout
  app.get('/logout', function (req, res) {
    req.logout(() => {
      res.redirect('/');
    });
  });

  // GET secrets
  app.get('/secrets', (req, res) => {
    User.find({ secret: { $ne: null } }, function (err, foundUsers) {
      if (err) {
        console.log(err);
      } else {
        if (foundUsers) {
          res.render('secrets', { usersWithSecrets: foundUsers });
        }
      }
    });
  });
};
