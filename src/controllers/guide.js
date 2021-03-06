angular.module('adventureApp')
  .controller("guideCtrl", function($scope, $state, cityService, userService, $http, $stateParams, mapService) {
    $http.get('/guide/' + $state.params.guideid)
      .then(function(resp) {
        $scope.city = resp.data.location;
        $scope.placeArray = resp.data.destinations;
        $scope.owner = resp.data.user;
        $scope.guidename = resp.data.guideName;
        mapService.createMap(resp.data.location, resp.data.destinations);
        $scope.map = mapService.map;
        $scope.deletable = $scope.owner === $scope.currentUser ? true : false;
        $scope.addable = $scope.currentUser === $scope.owner ? true : false;
        $scope.favoritable = $scope.currentUser !== $scope.owner ? true : false;
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
          $scope.placeArray = resp.data.destinations;
        })
        .catch(function(err) {
          console.error(err);
        });

      $scope.addInput = "";
      $('#addModal').modal('hide');
    };

    $scope.delete = function(deleteId) {

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
    $scope.star = function(){
      var starred = {
        guidename: $scope.guidename,
        username: $scope.name,
        location: $scope.city,
        id: $state.params.guideid
      };
      $http.patch('/user/'+$scope.currentUser, starred)
      .then(function(resp) {
        console.log('favorite saved ', resp);

      })
      .catch(function(err) {
        console.error(err);
      });
      swal("Hooray!", "A guide has been added to your favorites list.", "success");
    };

  });
