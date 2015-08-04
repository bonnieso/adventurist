module.exports = function(app, passport) {

  app.get('/', function(req, res, next) {
    // res.json(isLoggedIn(req));
    res.render('layout');
  });

  app.get('/auth', function(req, res, next) {
    res.json(isLoggedIn(req));
    // res.render('layout', isLoggedIn(req));
  });

  app.get('/login', function(req, res) {
    res.render('layout');
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/',
    failureRedirect : '/login'
  }));

  app.get('/signup', function(req, res) {
    res.render('layout');
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/',
    failureRedirect : '/signup'
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  }); 
};


function isLoggedIn(req) {
  var auth = {};
  if (req.isAuthenticated()) {
    auth.isAuth = true;
  }
  auth.isAuth = false;
  return auth;
}
