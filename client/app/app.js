angular.module('boorishpenguin', [

  'boorish.services',
  'boorish.session',
  'boorish.detail',
  'boorish.users',
  'boorish.ask',
  'boorish.questions',
  'boorish.answers',
  'boorish.auth',
  'myChat',
  'ngRoute'
  ])

.config(function ($routeProvider, $sceProvider) {
  $routeProvider
      .when('/', {
      templateUrl: 'app/questions/questions.html',
      controller: 'questionsController'
    })
      .when('/ask', {
      templateUrl: 'app/ask/ask.html',
      controller: 'askController'
    })
      .when('/questions', {
      templateUrl: 'app/questions/questions.html',
      controller: 'questionsController'
    })
      .when('/questions/:id', {
      templateUrl: 'app/answers/answers.html',
      controller: 'answersController'
    })
      .when('/users', {
      templateUrl: 'app/users/users.html',
      controller: 'UsersController'
    })
      .when('/session',{
        templateUrl: 'app/session/session.html',
        controller: 'SessionController'
      })
      .when('/sessions/:id', {
        controller: 'DetailsController',
        templateUrl: 'app/detail/detail.html'
      })
      .when('/livestream',{
        templateUrl: 'app/chat/chat.html',
        controller: 'chatController'
      })
      .when('/signin', {
      templateUrl: 'app/auth/signin.html',
      controller: 'AuthController'
    })
    .otherwise({
      routeTo: '/signin'
    });

  $sceProvider.enabled(false);
});
