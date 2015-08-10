angular.module('adventureApp')
  .service('mapService', function () {
    var self = this;
    this.map;
    this.createMap = function(location){
      //
      var geocoder = new google.maps.Geocoder();
      var lat, long;
      geocoder.geocode({
        'address': location
      }, function (results, status) {
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

              var neighborhoods = [
                new google.maps.LatLng(37.548270, -121.988572),
                new google.maps.LatLng(37.550253, -121.980229),
                new google.maps.LatLng(37.492366, -121.927831)
              ];

              var createMarker = function(position) {
                markers.push(new google.maps.Marker({
                  map: self.map,
                  position: position,
                  animation: google.maps.Animation.DROP
                }));
              };

              neighborhoods.forEach(createMarker);
        } else {
          console.log("Error: " + status);
        }
      });
  };
  });
