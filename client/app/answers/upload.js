 var uploadF = angular.module('uploadF', []);

 uploadF.directive('fileModel', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileModel);
      var modelSetter = model.assign;
                  
      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);
      
uploadF.service('fileUpload', ['$http', function ($http) {
  this.uploadFileToUrl = function(file, uploadUrl){
    var fd = new FormData();
    fd.append('file', file);
            
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined},
      // method: 'POST',
      // url: '/townhall/upload',
      // data: JSON.stringify({uprl: uploadUrl})
    })
            
    .success(function(){
    })
            
    .error(function(){
    });
  };
}]);
      
uploadF.controller('myCtrl', ['$scope', 'fileUpload', function($scope, fileUpload){
    $scope.uploadFile = function(){
      var file = $scope.myFile;
               
      console.log('file is ' );
      console.dir(file);
               
      var uploadUrl = "/fileUpload";
      fileUpload.uploadFileToUrl(file, uploadUrl);
  };
}]);