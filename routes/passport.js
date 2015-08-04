module.exports = function(app, passport) {

//  app.get('/', isLoggedIn, function(req, res, next) {
//    res.render('index');
//  });
  
  app.get('/', function(req, res, next) {
    res.render('layout');
  });

app.get('/loginFailure', function(req, res, next) {
  res.send('Failed to authenticate');
});
 
app.get('/loginSuccess', function(req, res, next) {
  res.send('Successfully authenticated');
});

  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/loginSuccess',
    failureRedirect : '/loginFailure'
  }));

  app.get('/signupSuccess', function(req, res) {
    res.send('Successfully added');
  });

  app.get('/signupFailure', function(req, res) {
    res.send('Failed to add user');
  });
  
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/signupSuccess',
    failureRedirect : '/signupFailure'
  }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}
