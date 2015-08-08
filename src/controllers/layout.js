angular.module('adventureApp')
  .controller("layoutCtrl", function ($scope, $state, $http, $rootScope) {
    $scope.adduser = function (user) {
      $http.post('/signup', user)
        .then(function (resp) {
        console.log('signed up ', resp.data);
        })
        .catch(function (err) {
          console.error(err);
        });
      $('#signupModal').modal('hide');
    };

    $scope.login = function (user) {
      $http.post('/login', user)
        .then(function (resp) {
          console.log('logged in ', resp);
          $rootScope.currentUser = resp.data.user._id;
          $rootScope.userName = resp.data.user.name;
          $rootScope.signedIn = true;
           $state.go('profile');
        })
        .catch(function (err) {
          console.error(err);
        });
      $('#loginModal').modal('hide');
    };

    $scope.updateProfile = function(user){
      console.log('testing root scope current user ', $scope.currentUser );
      $http.patch('/user', user)
        .then(function (resp) {
          console.log('user updated ', resp.data);
        })
        .catch(function (err) {
          console.error(err);
        });
      $('#profileModal').modal('hide');
    };

    $scope.logOut = function(){
      $http.get('/logout')
        .then(function (resp) {
          console.log('logged out', resp);
          $scope.signedIn = false;
          $state.go("index");
        })
        .catch(function (err) {
          console.error(err);
        });
    };
  })
  .controller("indexCtrl", function ($scope, $state, cityService) {
    $scope.go = function () {
      $state.go("board");
    };

    $scope.initialize = cityService.getCity();

  });
