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
