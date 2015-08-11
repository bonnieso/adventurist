angular.module('adventureApp')
  .controller("browseCtrl", function ($scope, $http) {
    var placePhoto = './../images/map.jpg';
    $http.get('/allGuides')
      .then(function (resp) {
        $scope.guideData = resp.data;
        $scope.guideArray = $scope.guideData.map(function(item){
          return {
            _id: item._id,
            photo: placePhoto,
            url: "/#/guide/"+item._id,
            location: item.location,
            owner: item.user,
            guidename: item.guideName,
            ownername: item.userName
          };
        });
      })
      .catch(function (err) {
        console.error(err);
      });

  });
