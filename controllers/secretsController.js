module.exports = function (app, User) {
  // GET logout
  app.get('/logout', function (req, res) {
    // Log out the user
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  });

  // GET secrets
  app.get('/secrets', (req, res) => {
    // Make sure user cant navigate back to /secrets page
    res.set(
      'Cache-Control',
      'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    // Check if user is authenticated
    if (req.isAuthenticated()) {
      res.render('secrets');
    } else {
      res.redirect('/login');
    }
  });
};
