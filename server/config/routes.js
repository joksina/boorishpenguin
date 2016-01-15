var questionControllers = require ('../controllers/questionController.js');
var answerControllers = require ('../controllers/answerController.js');
var userControllers = require ('../controllers/userControllers.js');
var courseControllers = require ('../controllers/courseControllers.js');
var tagControllers = require ('../controllers/tagControllers.js');
var sessionControllers = require('../controllers/sessionController.js');
var passport = require('passport');
var db = require('../db/index.js');

module.exports = function(app, express, ensureAuth) {

  app.get('/townhall/questions', ensureAuth, questionControllers.allQuestions);
  app.post('/townhall/questions', ensureAuth, questionControllers.newQuestion);
  app.delete('/townhall/questions/:id', ensureAuth, questionControllers.deleteQuestion);

  app.get('/townhall/questions/:id', ensureAuth, questionControllers.readQuestion);
  app.post('/townhall/questions/:id', ensureAuth, questionControllers.modQuestion);

  app.post('/townhall/sessions', ensureAuth, sessionControllers.newSession);
  app.post('/townhall/sessionQ',  ensureAuth, sessionControllers.addSessionQuestion);
  app.get('/townhall/sessions', ensureAuth, sessionControllers.allSessions);
  app.get('/townhall/sessions/:id', ensureAuth, sessionControllers.readSession);

  app.post('/townhall/answers', ensureAuth, answerControllers.newAnswer);
  app.post('/townhall/answers/:id', ensureAuth, answerControllers.modAnswer);
  app.delete('/townhall/answers/:id', ensureAuth, answerControllers.deleteAnswer);

  app.get('/townhall/users', ensureAuth, userControllers.allUsers);
  app.get('/townhall/users/:id', ensureAuth, userControllers.oneUser);
  app.post('/townhall/signup', userControllers.newUser);

  app.get('/townhall/courses', ensureAuth, courseControllers.allCourses);

  app.get('/townhall/tags', ensureAuth, tagControllers.allTags);

  // Client does get request to /auth/google on signin
  app.get('/auth/google',
      passport.authenticate('google', { scope:  ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.me', "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"] }));

  // Server.js:38 sends get req to /auth/google/callback after user has successfully logged into google
  app.get('/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/' }),
      function(req, res) {
        // sends user to questions page after they successfully login
        res.redirect('/#/questions');
      });

  app.get('/user', ensureAuth, function (req, res){
    // sends google user data to client so they can know whose currenty logged in
    res.json(req.user);
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/#/signin');
  });

};
