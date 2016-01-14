var express = require('express');
var bodyParser = require('body-parser');
var googleAuth = require('./auth/googleAuth.js');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var apikeys = require('./config/apikeys.js');
var controllers = require('./controllers/userControllers.js');
var app = express();
var port = process.env.PORT || 8001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/../client'));
app.use(cookieParser());
app.use(session({ secret: 'hi' , resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
require('./config/routes.js')(app, express, googleAuth.ensureAuth);

app.listen(port);
module.exports = app;

/* If you decide to move passport functionality to another file make sure you use the same instance of passport
rather than requiring passport in multiple files */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// When user logged in does a get req to auth/google/callback
passport.use(new GoogleStrategy({
  clientID: apikeys.googleOauth.clientID,
  clientSecret: apikeys.googleOauth.clientSecret,
  // callbackURL: "https://intellect-flow.herokuapp.com/auth/google/callback"
  callbackURL: "http://127.0.0.1:8001/auth/google/callback"
},
  function(accessToken, refreshToken, profile, done) {
    controllers.isUserInDb(profile.emails[0].value, function (inDb){
      // if the username/email is in the database run login
      if(inDb){
        googleAuth.login({profile: profile}, function (err, profile){
          return done(err, profile);
        });
      } else {
        googleAuth.signup({profile: profile}, function (err, profile){
          return done(err, profile);
        });
      }
    });
}));
