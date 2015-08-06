angular.module('adventureApp')  
  .controller("layoutCtrl", function ($scope, $state, userService, $http, $rootScope) {
    $scope.adduser = function (user) {
      $http.post('/signup', user)
        .then(function (resp) {
        console.log('signed up ', resp.data);
          $state.go('login');
        })
        .catch(function (err) {
          console.error(err);
        })
      $('#signupModal').modal('hide');
    };
    
    $scope.login = function (user) {
      $http.post('/login', user)
        .then(function (resp) {
          console.log('logged in ', resp);
          userService.user = resp.data.user;
          $rootScope.signedIn = true;
           $state.go('user');
        })
        .catch(function (err) {
          console.error(err);
        })
      $('#loginModal').modal('hide');
    };
    
    $scope.updateProfile = function(user){
      $http.post('/user', user)
        .then(function (resp) {
          console.log('user updated ', resp.data);
        })
        .catch(function (err) {
          console.error(err);
        })
      $('#profileModal').modal('hide');
    }
    
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
    
  })