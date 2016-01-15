/**
 * Created by hridhya on 1/12/16.
 */
angular.module('boorish.session', [])

    .controller('SessionController', function($scope, Auth, $location, $window, Sessions){

        $scope.session = {};

        if (!Auth.isAuth()) {
            $location.path('/signin');
        } else {

            $scope.createEvent = function () {
                $scope.session.userId = $window.localStorage.getItem('com.boorish');  // pulls userId from localStorage
                $scope.session.course = $scope.Course; // pulls selected course
                $scope.session.time = $scope.Time;  // pulls selected tag
                Sessions.addSession($scope.session)
                    .then(function () { // adds new Question with addQuestion factory method
                    $location.path('/questions'); // redirects to all questions
                });
            }
        }
    });