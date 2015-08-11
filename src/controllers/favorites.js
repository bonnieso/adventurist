angular.module('adventureApp')
  .controller("favoritesCtrl", function ($scope, $http) {
    var placePhoto = './../images/map.jpg';

    $http.get('/user/' + $scope.currentUser)
    .then(function (resp) {
      $scope.favorites = resp.data.favorites;
      $scope.favoritesArray = $scope.favorites.map(function(item){
        return {
          _id: item._id,
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

    $scope.remove = function(deleteId) {

      $http.patch('/favorite/' + $scope.currentUser, {
          id: deleteId
        })
        .then(function(resp) {
          console.log('favorite removed ', resp);
        })
        .catch(function(err) {
          console.error(err);
        });

        $http.get('/user/' + $scope.currentUser)
        .then(function (resp) {
          $scope.favorites = resp.data.favorites;
          $scope.favoritesArray = $scope.favorites.map(function(item){
            return {
              _id: item._id,
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
    };

  });
