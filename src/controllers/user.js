angular.module('adventureApp')
  .controller("userCtrl", function ($scope, $state, $http, userService, $rootScope) {


    $scope.updateProfile = function(user){
      var updateUser = {userId: $scope.currentUser, user: user};
      $http.patch('/user', updateUser)
        .then(function (resp) {
          console.log('user updated ', resp.data);
          $rootScope.userName = resp.data.name;
          console.log('testing username in user ', $rootScope.userName );
          $state.go('profile');
        })
        .catch(function (err) {
          console.error(err);
        });
    };
  });
