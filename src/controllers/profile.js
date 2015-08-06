angular.module('adventureApp')  
  .controller("profileCtrl", function ($scope, $state, $http, userService) {
    $scope.name = userService.user.username;
    $scope.email = userService.user.email;
    $scope.location = userService.user.location;
    $scope.bio = userService.user.bio;
    $scope.photo = userService.user.photo;
  });