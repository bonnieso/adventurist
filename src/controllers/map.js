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
