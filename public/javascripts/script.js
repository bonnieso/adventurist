"use strict";

var app = angular.module('adventureApp', ['ui.router'])
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
  })
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
    this.getPlace = function () {

    };
  })
  .controller("indexCtrl", function ($scope, $state, cityService) {
    $scope.go = function () {
      $state.go("board");
    };

    $scope.initialize = cityService.getCity();
    
    $scope.adduser = function (user) {
      $http.post('/signup', user)
        .then(function (data) {
//          $state.go('login');
        })
        .catch(function (err) {
          console.error(err);
        })
    };
    
    $scope.login = function (user) {
      $http.post('/login', user)
        .then(function (data) {
          console.log(data);
          // $state.go('index');
        })
        .catch(function (err) {
          console.error(err);
        })
    };
  })
  .controller("boardCtrl", function ($scope, $state, cityService, $http) {
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