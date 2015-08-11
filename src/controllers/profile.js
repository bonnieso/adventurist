angular.module('adventureApp')
  .controller("profileCtrl", function ($scope, $state, $http, cityService) {
    $http.get('/user/' + $scope.currentUser)
    .then(function (resp) {
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

    $scope.go = function (guide) {
      $scope.city = cityService.outCity;
      console.log('this is username in profile.js ', $scope.userName);
      $http.post('/guide', {city: $scope.city, user: $scope.currentUser, guidename: guide.name, username: $scope.userName})
      .then(function(resp){
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
