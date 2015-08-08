angular.module('adventureApp')
  .controller("userCtrl", function ($scope, $state, $http, userService) {
          // console.log('testing root scope current user ', $scope.currentUser );

    $scope.updateProfile = function(user){
      var updateUser = {userId: $scope.currentUser, user: user};
      $http.patch('/user', updateUser)
        .then(function (resp) {
          console.log('user updated ', resp.data);
        })
        .catch(function (err) {
          console.error(err);
        });
    };
  });
