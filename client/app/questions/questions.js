
angular.module('boorish.questions', ['angularMoment'])


.controller('questionsController', function($scope, $location, Questions, Auth, $routeParams) {
  $scope.questions = [];
  $scope.sessions = [];
  $scope.userSession = {};

  Auth.setUser();

  $scope.init = function() {
    //$scope.goto_detail = function(newSession){
    //  //alert($(elem.parent()).serialize());
    //  console.log(newSession);
    //  $scope.userSession = newSession;
    //  $location.path('/detail/' + $scope.userSession.id);
    //};

    Questions.getAllQuestions().then(function(data) {
      $scope.questions = data.results;
    });

    Questions.getAllSessions()
        .then(function(data){
          var inList = data.data.results;
          $scope.sessions = data.data.results;
          console.log(data.data.results);
        })
  };


  // if user is not authenticated, reroute to /signin
  if (!Auth.isAuth()) {
    $location.path('/signin');
  // else show questions
  } else {
    $scope.init();
  }
});
