$(document).ready(function() {
  $.ajax({
    url: "data/routedata.json",
    dataType: "json",
    function(Data) {
      var datalength = issueList.length;
      var waypoints_array;
      var placename, placelatitude,placelongitude;

      var WAYpoint = Data.waypoint_pos;

      for(i=0; i<datalength; i++) {
        waypoints_array = WAYpoint[i].name;
        placelatitude = WAYpoint[i].latitude;
        placelongitude = WAYpoint[i].longitude;
      }

      var rendererOptions = {
        draggable: true
      };
      var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);;
      var directionsService = new google.maps.DirectionsService();
      var map;

      var place = new google.maps.LatLng(placelatitude, placelongitude);

      function initialize() {

        var mapOptions = {
          zoom: 7,
          center: place
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'));

        google.maps.event.addListener(directionsDisplay, 'directions_changed', function() {
          computeTotalDistance(directionsDisplay.getDirections());
        });
        getLocation();
  // calcRoute();
}

function calcRoute(current_pos) {

  var request = {
    origin: current_pos,
    destination: destination_pos,
    waypoints: waypoints_array,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      current_pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      calcRoute(current_pos);
    });
  } else { 
    alert ("Geolocation is not supported by this browser.");
  }
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000.0;
  document.getElementById('total').innerHTML = total + ' km';
}

//google.maps.event.addDomListener(window, 'load', initialize);

}
});
})
google.maps.event.addDomListener(window, 'load', initialize);
