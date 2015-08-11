angular.module('adventureApp')
  .controller("userCtrl", function ($scope, $state, $http, userService) {
          // console.log('testing root scope current user ', $scope.currentUser );

    $scope.updateProfile = function(user){
      var updateUser = {userId: $scope.currentUser, user: user};
      $http.patch('/user', updateUser)
        .then(function (resp) {
          console.log('user updated ', resp.data);
          $scope.userName = resp.data.name;
          $state.go('profile');
        })
        .catch(function (err) {
          console.error(err);
        });
    };
  });
