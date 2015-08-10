angular.module('adventureApp')
  .service('mapService', function($http) {
    var self = this;
    this.map;
    this.createMap = function(location, destinations) {
      //
      var geocoder = new google.maps.Geocoder();
      var lat, long;
      geocoder.geocode({
        'address': location
      }, function(results, status) {
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

          var neighborhoods = [];

          for (var i = 0; i < destinations.length; i++) {
            $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + destinations[i].address + '&key=AIzaSyBsgAAfqvQyH1pPzsQELNCUiMTjfVUNF5A')
              .then(function(resp) {
                neighborhoods.push(new google.maps.LatLng(resp.data.results[0].geometry.location.lat, resp.data.results[0].geometry.location.lng));

                var createMarker = function(position) {
                  markers.push(new google.maps.Marker({
                    map: self.map,
                    position: position,
                    animation: google.maps.Animation.DROP
                  }));
                };

                neighborhoods.forEach(createMarker);

              })
              .catch(function(err) {
                console.error(err);
              });
          }

        } else {
          console.log("Error: " + status);
        }
      });
    };
    this.center = function(location) {
      $http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key=AIzaSyBsgAAfqvQyH1pPzsQELNCUiMTjfVUNF5A')
        .then(function(resp) {
          self.map.setCenter(new google.maps.LatLng(resp.data.results[0].geometry.location.lat, resp.data.results[0].geometry.location.lng));
        })
        .catch(function(err) {
          console.error(err);
        });
    };

  });
