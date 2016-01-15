angular.module('boorish.detail', [])

.controller('DetailsController', function($scope, $location, $window, Sessions, Questions, Users, Auth){


    $scope.data = {};
    $scope.ses = {};


    $scope.getSession = function(){
        var path = $location.path();
        console.log(path);
        Questions.getSession(path)
            .then(function(res){

                $scope.data.question = res.data.results[0];
                $scope.data.questions = res.data.results.slice(1);
                console.log($scope.data.questions );

            })
    };

    $scope.addSessionQ = function(){
        var id_session = $scope.data.question.id;
        console.log(id_session);
        Users.getUserWithId().then(function(userID) { // grabs the userID
            $scope.ses.user = userID; // adds the userID to the answer
            console.log(userID)
        });
        console.log($scope.ses);
        Sessions.postSessionQ($scope.ses, id_session)
            .then(function() {

        });
    };

    $scope.showModal = false;
    $scope.toggleModal = function(){
        $scope.showModal = !$scope.showModal;
    };




    if (!Auth.isAuth()) {
        $location.path('/signin');
    } else {
        $scope.getSession();
    }

})

.directive('modal', function () {
    return {
        template: '<div class="modal fade">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
        '<h4 class="modal-title">{{ title }}</h4>' +
        '</div>' +
        '<div class="modal-body" ng-transclude></div>' +
        '</div>' +
        '</div>' +
        '</div>',
        restrict: 'E',
        transclude: true,
        replace:true,
        scope:true,
        link: function postLink(scope, element, attrs) {
            scope.title = attrs.title;

            scope.$watch(attrs.visible, function(value){
                if(value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function(){
                scope.$apply(function(){
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
});

