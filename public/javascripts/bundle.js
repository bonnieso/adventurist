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
      .state('guide', {
        url: '/guide/:guideid',
        templateUrl: '../views/guide.html',
        controller: 'guideCtrl'
      })
      .state('browse', {
        url: '/browse',
        templateUrl: '../views/browse.html',
        controller: 'browseCtrl'
      })
      .state('favorites', {
        url: '/favorites',
        templateUrl: '../views/favorites.html',
        controller: 'favoritesCtrl'
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
  .controller("browseCtrl", function ($scope, $http) {
    var placePhoto = './../images/map.jpg';
    $http.get('/allGuides')
      .then(function (resp) {
        $scope.guideData = resp.data;
        // console.log('guide data ', Array.isArray(resp.data));
        $scope.guideArray = $scope.guideData.map(function(item){
          return {_id: item._id, photo: placePhoto, url: "/#/guide/"+item._id, location: item.location, owner: item.user};
        });
      })
      .catch(function (err) {
        console.error(err);
      });

  });

angular.module('adventureApp')
  .controller("favoritesCtrl", function ($scope, $http) {
    $http.get('/allGuides')
      .then(function (resp) {
        $scope.guideData = resp.data;
        // console.log('guide data ', Array.isArray(resp.data));
        $scope.guideArray = $scope.guideData.map(function(item){
          return {_id: item._id, photo: placePhoto, url: "/#/guide/"+item._id, location: item.location, owner: item.user};
        });
      })
      .catch(function (err) {
        console.error(err);
      });

  });

angular.module('adventureApp')
  .controller("guideCtrl", function($scope, $state, cityService, userService, $http, $stateParams) {
    $http.get('/guide/' + $state.params.guideid)
      .then(function(resp) {
        console.log('got destinations ', resp);
        $scope.city = resp.data.location;
        $scope.placeArray = resp.data.destinations;
        $scope.owner = resp.data.user;
      })
      .catch(function(err) {
        console.error(err);
      });

    $http.get('/user', {
        id: $scope.owner
      })
      .then(function(resp) {
        // console.log('got user data ', resp.data);
        $scope.name = resp.data.name;
        // $scope.nameguide = resp.data.name + "'s Guides";
        // $scope.email = resp.data.email;
        // $scope.location = resp.data.location;
        // $scope.bio = resp.data.bio;
      })
      .catch(function(err) {
        console.error(err);
      });

    $scope.initialize = cityService.getLatLong();

    $scope.addDestination = function() {
      var placePhoto;

      if (cityService.somePlace.photos) {
        placePhoto = cityService.somePlace.photos[0].getUrl({
          'maxWidth': 300,
          'maxHeight': 300
        });
      } else {
        placePhoto = './../images/placeholder.jpg';
      }

      var destination = {
        name: cityService.somePlace.name,
        url: cityService.somePlace.website,
        address: cityService.somePlace.formatted_address,
        // categories: cityService.somePlace.types.join(", "),
        photo: placePhoto
      };

      $http.patch('/guide/' + $state.params.guideid, destination)
        .then(function(resp) {
          console.log('destination added ', resp);
          $('#addModal').modal('hide');
        })
        .catch(function(err) {
          console.error(err);
        });

      $http.get('/guide/' + $state.params.guideid)
        .then(function(resp) {
          console.log('got destinations ', resp);
          $scope.placeArray = resp.data.destinations;
        })
        .catch(function(err) {
          console.error(err);
        });

      $scope.addInput = "";
      $('#addModal').modal('hide');
    };

    $scope.delete = function($index) {
      // $scope.placeArray.splice($index, 1);

      $http.delete('/guide/' + $state.params.guideid, {id: $scope.placeArray[$index]._id})
        .then(function(resp) {
          console.log('destination removed ', resp);
        })
        .catch(function(err) {
          console.error(err);
        });
    };

    $scope.saveGuide = function() {
      var guide = {
        location: $scope.city,
        user: userService.user.username,
        destinations: $scope.placeArray
      };
      $http.post('/guide', guide)
        .then(function(resp) {
          console.log('guide saved ', resp);
        })
        .catch(function(err) {
          console.error(err);
        });
    };

  });

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

angular.module('adventureApp')
  .controller("profileCtrl", function ($scope, $state, $http, cityService) {
    $http.get('/user', {id: $scope.currentUser})
    .then(function (resp) {
      console.log('got user data ', resp.data);
      $scope.name = resp.data.name;
      $scope.nameguide = resp.data.name + "'s Guides";
      $scope.email = resp.data.email;
      $scope.location = resp.data.location;
      $scope.bio = resp.data.bio;
      // $scope.photo = resp.data.photo;
    })
    .catch(function (err) {
      console.error(err);
    });

    var placePhoto = './../images/map.jpg';

    $http.get('/allGuides')
    .then(function (resp) {
      $scope.guideData = resp.data;
      // console.log('guide data ', Array.isArray(resp.data));
      $scope.guideArray = $scope.guideData.map(function(item){
        return {_id: item._id, photo: placePhoto, url: "/#/guide/"+item._id, location: item.location, owner: item.user};
      });
    })
    .catch(function (err) {
      console.error(err);
    });

    $scope.go = function () {
      $scope.city = cityService.outCity;
      $http.post('/guide', {city: $scope.city, user: $scope.currentUser})
      .then(function(resp){
        console.log('guide added ', resp);
        $state.go("guide", { 'guideid': resp.data._id});
        $('#guideModal').modal('hide');
      })
      .catch(function (err) {
        console.error(err);
      });
    };

    $scope.initialize = cityService.getCity();

    $scope.delete = function(id) {
      console.log(id);

      $http.delete('/guide/'+id)
        .then(function(resp) {
          console.log('guide removed ', resp);
        })
        .catch(function(err) {
          console.error(err);
        });
      $http.get('/allGuides')
        .then(function (resp) {
          $scope.guideData = resp.data;
          // console.log('guide data ', Array.isArray(resp.data));
          $scope.guideArray = $scope.guideData.map(function(item){
            return {_id: item._id, photo: placePhoto, url: "/#/guide/"+item._id, location: item.location, owner: item.user};
          });
        })
        .catch(function (err) {
          console.error(err);
        });
    };


  });

angular.module('adventureApp')  
  .controller("userCtrl", function ($scope, $state, $http, userService) {

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