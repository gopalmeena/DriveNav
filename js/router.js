$(document).ready(function() {
  $.ajax({
    url: "data/routedata.json",
    dataType: "json",
    success: function(Data) {
      var waypoints_array = [];
      var placename, placelatitude,placelongitude;
      var destination_pos = [];
      var destination_loc;
      var WAYpoint = Data.waypoint_pos;
      var datalength = WAYpoint.length;
    
      for(i=0; i<datalength; i++) {
        if(WAYpoint[i].type === "waypoint")
        {
          var temp = [];
       // placename = WAYpoint[i].name;
        placelatitude = WAYpoint[i].latitude;
        placelongitude = WAYpoint[i].longitude;
       // temp.push(placename);
       var temp_loc = new google.maps.LatLng(placelatitude, placelongitude);
       //temp.push(placelatitude);
        //temp.push(placelongitude);
        waypoints_array.push(temp_loc);
        }
        else
        {
         // destination_pos.push(WAYpoint[i].name);
          var destination_loc = new google.maps.LatLng(WAYpoint[i].latitude, WAYpoint[i].longitude);
          //destination_pos.push(WAYpoint[i].latitude);
          //destination_pos.push(WAYpoint[i].longitude);
        }
        
      }
      console.log(waypoints_array);
      console.log(destination_loc);

      var rendererOptions = {
        draggable: true
      };
      var directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
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

function calcRoute(current_pos, waypoints_array, destination_pos) {
        console.log(waypoints_array);
      console.log(destination_loc);
  var request = {
    origin: current_pos,
    destination: destination_pos,
    waypoints: [{location: 'Spencers, Warangal'}, {location: 'Municipal Corportation, Warangal'}],
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    }
  });
}

function getLocation() {
      console.log(waypoints_array);
      console.log(destination_loc);
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      current_pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      calcRoute(current_pos, waypoints_array, destination_loc);
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

google.maps.event.addDomListener(window, 'load', initialize);

}
});
})