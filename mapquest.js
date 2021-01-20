var data = [
		["Hanas, Walter J", "Customer A", 	"MARSHALLTOWN", "IA",	"US"],
		["Pavlosky, Richard, J", "Customer B", "STREETSBORO", "OH", "US"],
		["Leos, Jorge",		"Customer C",	"HOUSTON",		"TX",	"US"],
		["Molek, Chris J.",	"Customer D",	"HILLSDALE",	"MI",	"US"],
		["Wallace, Pat",	"Customer E",	"NEW BOSTON",	"MI",	"US"],
		["Molek, Chris J.",	"Customer F",	"TAYLOR",		"MI",	"US"],
		["Niccolai, David",	"Customer G",	"ALSIP",		"IL",	"US"],
		["Teasley, Emily",	"Customer H",	"SOUTHFIELD", 	"MI",	"US"],
		["Niccolai, David",	"Customer I",	"DEERFIELD",	"IL",	"US"],
		["Galish, John D",	"Customer J",	"BIRMINGHAM",	"AL",	"US"],
		["O'Rourke, Ed",	"Customer K",	"INDIANOLA",	"PA",	"US"],
		["Galish, John D",	"Customer L",	"HOOVER",		"AL",	"US"],
		["Hanas, Walter J",	"Customer M",	"BEDFORD PARK",	"IL",	"US"]
		];
	var nameUnique = [];
	var key = 'imdY24Bg00uiYRbaHSd066pf3JcyySBn'
	L.mapquest.key = key;
	
	// 'map' refers to a <div> element with the ID map
	var map = L.mapquest.map('map', {
	  center: [39, -96],
	  layers: L.mapquest.tileLayer('map'),
	  zoom: 4
	});
	
	for(var i = 0; i < data.length; i++){
		var name = data[i][0];
		var customer = data[i][1];
		var city = data[i][2];
		var state = data[i][3];
		var country = data[i][4];
		if(!nameUnique.includes(name)){
			nameUnique.push(name);
		}
		getCoor(city, state, name, customer).then(fromData => {
			var latLng = fromData[0].results[0].locations[0].displayLatLng;
			L.mapquest.textMarker([latLng.lat, latLng.lng], {
				text: fromData[1],
				subtext: fromData[2],
				position: 'down',
				type: 'marker',
				icon: {
				primaryColor: strToColor(fromData[1]),
				secondaryColor: '#000000',
				size: 'sm'
				}
			}).addTo(map);
		});
		
		
	}
	
	nameUniqueOrdered = [[nameUnique[0], timesIn(nameUnique[0])]];
	for(var i = 1; i < nameUnique.length; i++){
		var count = timesIn(nameUnique[i]);
		for(var j = 0; j < nameUniqueOrdered.length; j++){
			if(count >= nameUniqueOrdered[j][1]){
				nameUniqueOrdered.splice(j, 0, [nameUnique[i], count]);
				break;
			}
			else if(j == nameUniqueOrdered.length - 1){
				nameUniqueOrdered.push([nameUnique[i], count]);
				break;
			}
		}
		
	}
	for(var i = 0; i < nameUniqueOrdered.length; i++){
		document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding-left: 2px; font-size: 15px; border-style: solid; border-color: ' + strToColor(nameUniqueOrdered[i][0]) + ';">' + nameUniqueOrdered[i][0] + ' (' + nameUniqueOrdered[i][1] + ') </div>';
	}
	
	async function getCoor(city, state, name, customer){
		let response = await fetch('http://www.mapquestapi.com/geocoding/v1/address?key=' + key + '&location=' + city + "," + state);
		let data = await response.json()
		return [data,name,customer];
	}
	
	function timesIn(value){
		var count = 0;
		for(var i = 0; i < data.length; i++){
			if(data[i][0] == value){
				count++;
			}
		}
		return count;
	}
	
	function strToColor(str){
		var hash = 0;
		for(var i = 0; i < str.length; i++){
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		var color = "#";
		for (var i = 0; i < 3; i++){
			var value = (hash >> (i * 8)) & 0xFF;
			color += ('00' + value.toString(16)).substr(-2);
		}
		return color;
	}
	