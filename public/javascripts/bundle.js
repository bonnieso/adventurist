'use strict';

var app = angular.module('adventureApp', ['ui.router']);
angular.module('adventureApp')
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/')
    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: '../views/index.html',
        controller: 'indexCtrl'
      })
      .state('board', {
        url: '/board',
        templateUrl: '../views/board.html',
        controller: 'boardCtrl'
      })
      .state('user', {
        url: '/user',
        templateUrl: '../views/user.html',
        controller: 'userCtrl'
      })
      .state('profile', {
        url: '/profile',
        templateUrl: '../views/profile.html',
        controller: 'profileCtrl'
      })
      .state('myboard', {
        url: '/myboard',
        templateUrl: '../views/myboard.html',
        controller: 'myboardCtrl'
      })
  });
angular.module('adventureApp')
  .controller("boardCtrl", function ($scope, cityService) {
    $scope.city = cityService.outCity;
    $scope.initialize = cityService.getLatLong();
    $scope.placeArray = [];
    $scope.addDestination = function () {
      var placePhoto;

      if (cityService.somePlace.photos) {
        placePhoto = cityService.somePlace.photos[0].getUrl({
          'maxWidth': 300,
          'maxHeight': 300
        });
      } else {
        placePhoto = './../images/card.png';
      }

      var destination = {
        name: cityService.somePlace.name,
        url: cityService.somePlace.website,
        address: cityService.somePlace.formatted_address,
        categories: cityService.somePlace.types.filter(exclude).join(", "),
        photo: placePhoto
      }
      
      function exclude(value){
        return value !== "point_of_interest" || value !== "establishment";
      }

      $scope.placeArray.push(destination);

      $scope.addInput = "";
      $('#addModal').modal('hide');
    };
    
    $scope.delete = function($index){
      $scope.placeArray.splice($index, 1);
    };
    
  });
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
angular.module('adventureApp')
  .controller("myboardCtrl", function ($scope, cityService, userService, $http) {
    $scope.city = cityService.outCity;
    $scope.initialize = cityService.getLatLong();
    $scope.placeArray = [];
    $scope.addDestination = function () {
      var placePhoto;

      if (cityService.somePlace.photos) {
        placePhoto = cityService.somePlace.photos[0].getUrl({
          'maxWidth': 300,
          'maxHeight': 300
        });
      } else {
        placePhoto = './../images/card.png';
      }

      var destination = {
        name: cityService.somePlace.name,
        url: cityService.somePlace.website,
        address: cityService.somePlace.formatted_address,
        categories: cityService.somePlace.types.filter(exclude).join(", "),
        photo: placePhoto
      };
      
      function exclude(value){
        return value !== "point_of_interest" || value !== "establishment";
      }

      $scope.placeArray.push(destination);

      $scope.addInput = "";
      $('#addModal').modal('hide');
    };
    
    $scope.delete = function($index){
      $scope.placeArray.splice($index, 1);
    };
    
    $scope.saveGuide = function(){
      var guide = {location: $scope.city, 
                   user: userService.user.username, 
                   destinations: $scope.placeArray};
      $http.post('/guide', guide)
        .then(function (resp) {
          console.log('guide saved ', resp);
        })
        .catch(function (err) {
          console.error(err);
        })
    };
    
  });
angular.module('adventureApp')  
  .controller("profileCtrl", function ($scope, $state, $http, userService) {
    $scope.name = userService.user.username;
    $scope.email = userService.user.email;
    $scope.location = userService.user.location;
    $scope.bio = userService.user.bio;
    $scope.photo = userService.user.photo;
  });
angular.module('adventureApp')
  .service('cityService', function () {
    var self = this;
    this.outCity = "Seattle, WA";
    this.lat;
    this.long;
    this.cityBounds;
    this.somePlace;
    this.someDetails;
    this.getCity = function () {
      var autocomplete;

      autocomplete = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */
        (document.getElementById('autocomplete')), {
          types: ['geocode']
        });

      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        self.outCity = place.formatted_address;
      });
    };
    this.getLatLong = function () {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'address': self.outCity
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          self.lat = results[0].geometry.location.lat();
          self.long = results[0].geometry.location.lng();
          
          self.cityBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(self.lat, self.long));
          
          var autocomplete;
          autocomplete = new google.maps.places.Autocomplete(
            /** @type {HTMLInputElement} */
            (document.getElementById('autocomplete')), {
              bounds: self.cityBounds,
              types: ['establishment']
            });

          google.maps.event.addListener(autocomplete, 'place_changed', function () {
            var place = autocomplete.getPlace();
            self.somePlace = place;
          });
        } else {
          console.log("Error: " + status);
        }
      });
    };
  });
angular.module('adventureApp')
  .service('userService', function () {
    this.user;
  });