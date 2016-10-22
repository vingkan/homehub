var userLocation = {
	latitude: 0,
	longitude: 0
};

function updateCoords(position){
	userLocation.latitude = position.location.latitude;
	userLocation.longitude = position.location.longitude;
	window.startApp();
}

function getGeoIP(callback){
	var x = new XMLHttpRequest();
	x.open('GET', 'https://geoip.nekudo.com/api/', false);
	x.send();
	var res = x.responseText;
	var geoip = JSON.parse(res);
	if(callback){
		callback(geoip);
	}
}

function initGoogleMap(markerArray){
	markerArray.push({
		getLat: function(){
			return userLocation.latitude;
		},
		getLon: function(){
			return userLocation.longitude;
		},
		name: 'You'
	});
	if(markerArray.length > 0){
		var centerPoint = markerArray[0];
		var mapProperties = {
			//center: new google.maps.LatLng(userLocation.latitude, userLocation.longitude),
			center: new google.maps.LatLng(centerPoint.getLat(), centerPoint.getLon()),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var mapDiv = document.getElementById('googleMap');
		var googleMap = new google.maps.Map(mapDiv, mapProperties);
		var oms = new OverlappingMarkerSpiderfier(googleMap);
		var infoWindow = new google.maps.InfoWindow();
		oms.addListener('click', function(marker, event){
			infoWindow.setContent(marker.title);
			infoWindow.open(googleMap, marker);
		});
		oms.addListener('spiderify', function(markers){
			infoWindow.close();
		});

		for(var m = 0; m < markerArray.length; m++){
			var current = markerArray[m];
			if(current){
				var marker = new google.maps.Marker({
					position: {
						lat: current.getLat(),
						lng: current.getLon()
					},
					map: googleMap,
					title: current.name
				});
				oms.addMarker(marker);
			}
		}
	}
	else{
		console.warn("Empty markerArray list.");
	}
}