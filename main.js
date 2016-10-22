var dataURL = "https://data.cityofchicago.org/resource/jmw7-ijg5.json"
var SECRET_TOKEN = "Le00VXF0GK0d8D1tTn2v6Vkpl";

function getData(query, callback, limit){
	query['$$app_token'] = SECRET_TOKEN;
	query['$limit'] = limit || 10;
	$.ajax({
		url: dataURL,
		method: "GET",
		dataType: "json",
		data: query,
		success: function(data, status, jqxhr){
			callback(data);
		},
		error: function(jqxhr, status, error){
			console.error("Critical Error!");
		}
	});
}

var LIMIT = 200; //Only 160 data points for Homeless Services

getData({division: "Homeless Services"}, function(data){
	main(data);
}, LIMIT);

function main(data){
	console.log(data);
	var markerList = data.map(function(item){
		var point = {
			name: item.agency,
			getLat: function(){
				return parseFloat(item.latitude, 10);
			},
			getLon: function(){
				return parseFloat(item.longitude, 10);
			}
		}
		return point;
	});
	initGoogleMap(markerList);
}