var livestream = angular.module('boorish.livestream', ['firebase']);

livestream.controller('livestreamController', function ($scope, $location, $routeParams, Questions) {
  $scope.youtubeUrl = 'https://www.youtube.com/v/XGorYyIA8rw?autoplay=1'; //add the youtube url here
  $scope.questions = [];
  Questions.getSession('/sessions/' + $routeParams.eventId).then(
    function (res) {
      var youTubeId = res.data.results[0].url;
      $scope.subject = res.data.results[0].course;
      $scope.eventDate = res.data.results[0].time;
      $scope.author = res.data.results[0].user;

      $scope.youtubeUrl = 'https://www.youtube.com/v/' + youTubeId + '?autoplay=1';
      console.log($scope.user)
    })
});

livestream.controller("chatController", ["$scope", "$firebaseArray",
  function ($scope, $firebaseArray) {
    var ref = new Firebase("https://joksina.firebaseio.com/");
    $scope.messages = $firebaseArray(ref);
    //ADD MESSAGE METHOD
    $scope.addMessage = function (e) {
      //LISTEN FOR RETURN KEY
      if (e.keyCode === 13 && $scope.msg) {
        //ALLOW CUSTOM OR ANONYMOUS USER NAMES
        var name = $scope.name || "anonymous";
        $scope.messages.$add({from: name, body: $scope.msg});
        //RESET MESSAGE
        $scope.msg = "";
        $scope.scrollChat();
      }
    };

    $scope.scrollChat = function () {
      if ($('#chat')[0].scrollHeight > $('#chat').outerHeight()) {
        $('#chat').animate({
          scrollTop: $('#chat')[0].scrollHeight
        });
      }
    };
  }
]);

