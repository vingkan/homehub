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

function getLocalData(){
	var MAP_DATA = localStorage.getItem('map_data');
	var data = JSON.parse(MAP_DATA);
	return data;
}

function nearbyServices(){
	getData({'$where': 'within_circle(location, ' + userLocation.latitude + ', ' + userLocation.longitude + ', ' + radius + ')'}, function(data){
		console.log('nearby', data);
		var nearbyDiv = document.getElementById('nearby');
		var html = '';
		for(var i = 0; i < data.length; i++){
			var service = data[i];
			html += '<p>' + service.program_model + '</p>';
		}
		nearbyDiv.innerHTML = html;
	});
}

function whenOnline(){
	getData({division: "Homeless Services"}, function(data){
		//Populate program models in selector
		var optMap = {};
		for(var d in data){
			if(data[d]){
				optMap[data[d].program_model] = true;
			}
		}
		var selector = document.getElementById('program');
		selector.innerHTML = '';
		for(var i in optMap){
			if(optMap[i]){
				selector.innerHTML += '<option value="' + i + '">' + i + '</option>';
			}
		}
		//Store data in localStorage
		var MAP_DATA = JSON.stringify(data);
		localStorage.setItem('map_data', MAP_DATA);
		handleData(data);
	}, LIMIT);
}

function whenOffline(){
	var data = getLocalData();
	handleData(data);
}

function handleData(data, filterFn){
	var filterPoint = filterFn || function(input){
		return true;
	}
	var markerList = data.map(function(item){
		if(filterPoint(item)){
			var point = {
				name: item.program_model + ': ' + item.agency,
				getLat: function(){
					return parseFloat(item.latitude, 10);
				},
				getLon: function(){
					return parseFloat(item.longitude, 10);
				}
			}
			return point;
		}
		else{
			return false;
		}
	});
	var markerList = markerList.filter(function(item){
		return item;
	});
	initGoogleMap(markerList);
}

function filterProgram(){
	var selector = document.getElementById('program');
	console.log(selector.value);
	var data = getLocalData();
	handleData(data, function(item){
		return item.program_model === selector.value;
	});
}