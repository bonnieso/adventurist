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
