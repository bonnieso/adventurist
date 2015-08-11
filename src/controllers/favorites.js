angular.module('adventureApp')
  .controller("favoritesCtrl", function ($scope, $http) {
    var placePhoto = './../images/map.jpg';

    $http.get('/user/' + $scope.currentUser)
    .then(function (resp) {
      console.log('got user data ', resp.data);
      $scope.favorites = resp.data.favorites;
      $scope.favoritesArray = $scope.favorites.map(function(item){
        return {
          _id: item.id,
          photo: placePhoto,
          url: "/#/guide/"+item.id,
          location: item.location,
          guidename: item.guidename,
          ownername: item.username
        };
      });
    })
    .catch(function (err) {
      console.error(err);
    });

  });
