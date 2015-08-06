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