'use strict';

var app = angular.module('adventureApp', ['ui.router']);
(function() {
    "use strict";

    angular.module('adventureApp').directive("masonry", function () {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);

            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";

            return function (scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));

                // try to infer model from ngRepeat
                if (!options.model) {
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }

                // initial animation
                element.addClass('masonry');

                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);

                    element.on("$destroy", function () {
                        element.masonry('destroy');
                    });

                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;

                                // Wait inside directives to render
                                setTimeout(function () {
                                    element.masonry("reload");
                                });
                            });
                        });
                    }
                });
            };
        }
    };
});
})();

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
      .state('map', {
        url: '/map',
        templateUrl: '../views/map.html',
        controller: 'mapCtrl'
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
        placePhoto = './../images/placeholder.png';
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

    $scope.promptLogin = function(){
      swal('You must have an account to save a guide. Sign up for an account or log in.');
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
  .controller("guideCtrl", function($scope, $state, cityService, userService, $http, $stateParams, mapService) {
    $http.get('/guide/' + $state.params.guideid)
      .then(function(resp) {
        console.log('got destinations ', resp);
        $scope.city = resp.data.location;
        $scope.placeArray = resp.data.destinations;
        $scope.owner = resp.data.user;
        mapService.createMap(resp.data.location, resp.data.destinations);
        $scope.map = mapService.map;
        $scope.deletable = $scope.owner === $scope.currentUser ? true : false;
        //
        $http.get('/user/' + $scope.owner)
          .then(function(resp) {
            $scope.name = resp.data.name;
          })
          .catch(function(err) {
            console.error(err);
          });
        //
        $scope.mapSize = function() {
          google.maps.event.trigger(map, "resize");
          mapService.center(resp.data.location);
        };
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

    $scope.delete = function(deleteId) {
      // $scope.placeArray.splice($index, 1);

      $http.patch('/destination/' + $state.params.guideid, {
          id: deleteId
        })
        .then(function(resp) {
          console.log('destination removed ', resp);
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

    //


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
      swal("Hooray!", "You've successfully signed up! Log In to start your journey.", "success");
    };

    $scope.login = function (user) {
      $http.post('/login', user)
        .then(function (resp) {
          console.log('logged in ', resp);
          $rootScope.currentUser = resp.data.user._id;
          $rootScope.userName = resp.data.user.name;
          $rootScope.signedIn = true;
          if(resp.data.user.name){
            $state.go('profile');
          }
          else{
            $state.go('user');
          }

        })
        .catch(function (err) {
          console.error(err);
        });
      $('#loginModal').modal('hide');
    };

    $scope.updateProfile = function(user){
      var updateUser = {userId: $scope.currentUser, user: user};
      $http.patch('/user', updateUser)
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
.controller("mapCtrl", function ($scope, $state) {

  $scope.mapOptions = {
    zoom: 12,
    center: new google.maps.LatLng(52.520816, 13.410186),
    mapTypeId: google.maps.MapTypeId.TERRAIN
};

$scope.map = new google.maps.Map(document.getElementById('map'), $scope.mapOptions);

 $scope.markers = [];

 var neighborhoods = [
  new google.maps.LatLng(52.511467, 13.447179),
  new google.maps.LatLng(52.549061, 13.422975),
  new google.maps.LatLng(52.497622, 13.396110),
  new google.maps.LatLng(52.517683, 13.394393)
];

 var createMarker = function(position){
    $scope.markers.push(new google.maps.Marker({
        map: $scope.map,
        position: position,
        animation: google.maps.Animation.DROP
    }));
 };

neighborhoods.forEach(createMarker);

});

angular.module('adventureApp')
  .controller("profileCtrl", function ($scope, $state, $http, cityService) {
    console.log($scope.currentUser);
    $http.get('/user/' + $scope.currentUser)
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
  .service('mapService', function($http) {
    var self = this;
    this.map;
    this.createMap = function(location, destinations) {
      //
      var geocoder = new google.maps.Geocoder();
      var lat, long;
      geocoder.geocode({
        'address': location
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          lat = results[0].geometry.location.lat();
          long = results[0].geometry.location.lng();
          //
          var mapOptions = {
            zoom: 12,
            center: new google.maps.LatLng(lat, long)
          };

          self.map = new google.maps.Map(document.getElementById('map'), mapOptions);
          //
          var markers = [];

          var neighborhoods = [];

          for (var i = 0; i < destinations.length; i++) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + destinations[i].address + '&key=AIzaSyBsgAAfqvQyH1pPzsQELNCUiMTjfVUNF5A')
              .then(function(resp) {
                neighborhoods.push(new google.maps.LatLng(resp.data.results[0].geometry.location.lat, resp.data.results[0].geometry.location.lng));

                var createMarker = function(position) {
                  markers.push(new google.maps.Marker({
                    map: self.map,
                    position: position,
                    animation: google.maps.Animation.DROP
                  }));
                };

                neighborhoods.forEach(createMarker);

              })
              .catch(function(err) {
                console.error(err);
              });
          }

        } else {
          console.log("Error: " + status);
        }
      });
    };
    this.center = function(location) {
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=AIzaSyBsgAAfqvQyH1pPzsQELNCUiMTjfVUNF5A')
        .then(function(resp) {
          self.map.setCenter(new google.maps.LatLng(resp.data.results[0].geometry.location.lat, resp.data.results[0].geometry.location.lng));
        })
        .catch(function(err) {
          console.error(err);
        });
    };

  });

angular.module('adventureApp')
  .service('userService', function () {
    this.user;
  });