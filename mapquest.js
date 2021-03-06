// Temporary mock customer data
var data = [
    ["Hanas, Walter J", "Customer A", "MARSHALLTOWN", "IA", "US"],
    ["Pavlosky, Richard, J", "Customer B", "STREETSBORO", "OH", "US"],
    ["Leos, Jorge", "Customer C", "HOUSTON", "TX", "US"],
    ["Molek, Chris J.", "Customer D", "HILLSDALE", "MI", "US"],
    ["Wallace, Pat", "Customer E", "NEW BOSTON", "MI", "US"],
    ["Molek, Chris J.", "Customer F", "TAYLOR", "MI", "US"],
    ["Niccolai, David", "Customer G", "ALSIP", "IL", "US"],
    ["Teasley, Emily", "Customer H", "SOUTHFIELD", "MI", "US"],
    ["Niccolai, David", "Customer I", "DEERFIELD", "IL", "US"],
    ["Galish, John D", "Customer J", "BIRMINGHAM", "AL", "US"],
    ["O'Rourke, Ed", "Customer K", "INDIANOLA", "PA", "US"],
    ["Galish, John D", "Customer L", "HOOVER", "AL", "US"],
    ["Hanas, Walter J", "Customer M", "BEDFORD PARK", "IL", "US"]
];

// MapQuest API key
const key = "imdY24Bg00uiYRbaHSd066pf3JcyySBn";

var nameUnique = [];
var nameUniqueOrdered = [];
var map;
var featureGroup;
var layer;
var keys = [];
var types = ['and', 'or']
var fields = ['all', 'name', 'customer', 'city', 'state', 'country']

// Gets coordinates of given city/state
// Returns MapQuest response, employee name, and customer name
async function getCoor(city, state, name, customer) {
    let response = await fetch('https://www.mapquestapi.com/geocoding/v1/address?key=' + key + '&location=' + city + "," + state);
    let data = await response.json()
    return [data, name, customer];
}

//initialize searchVariables in url and for dropdowns
function initSearch(){
	const urlp = new URLSearchParams(window.location.search)
	var index = 0
	if(urlp.has('type')){
		index = types.indexOf(urlp.get('type'))
	}
	document.getElementById("searchType").innerHTML += '<option value='+types[index]+'>'+types[index]+'</option>'
	for(let i = 0; i < types.length; i++){
		if(i != index){
			document.getElementById("searchType").innerHTML += '<option value='+types[i]+'>'+types[i]+'</option>'
		}
	}
	
	index = 0
	if(urlp.has('field')){
		index = fields.indexOf(urlp.get('field'))
	}
	document.getElementById("searchField").innerHTML += '<option value='+fields[index]+'>'+fields[index]+'</option>'
	for(let i = 0; i < fields.length; i++){
		if(i != index){
			document.getElementById("searchField").innerHTML += '<option value='+fields[i]+'>'+fields[i]+'</option>'
		}
	}
}

//load keys from url
function loadkeys(){
	const urlp = new URLSearchParams(window.location.search)
	var search = urlp.get('search')
	if(search){
		urlKeysParsed = search.split('*')
		for(let i = 0; i < urlKeysParsed.length; i++){
			keys.push(urlKeysParsed[i])
		}
	}
}

//resets all of the keywords 
function reset(){
	var url = window.location.href;
    url = url.split('?')[0];
	location.href=url
}

//reload page with new keywords
function reload(newKey){
	const urlp = new URLSearchParams(window.location.search)
	if(urlp.has('search')){
		var search = urlp.get('search')
		search += "*" + newKey
		urlp.set('search', search)
	} else {
		urlp.append('search', newKey)
	}
	window.location.href = "?" + urlp.toString()
}

//add new keyword
function addKeyWord(){
	newKey = document.getElementById("search").value
	keys.push(newKey)
	reload(newKey)
}

//sets the search type
function setType(){
	newType = document.getElementById("searchType").value
	const urlp = new URLSearchParams(window.location.search)
	if(urlp.has('type')){
		urlp.set('type', newType)
	} else {
		urlp.append('type', newType)
	}	
	var url = window.location.href;
    url = url.split('?')[0];
	url += '?' + urlp.toString()
	window.location.href = url
}

//sets the search field
function setField(){
	newType = document.getElementById("searchField").value
	const urlp = new URLSearchParams(window.location.search)
	if(urlp.has('field')){
		urlp.set('field', newType)
	} else {
		urlp.append('field', newType)
	}	
	var url = window.location.href;
    url = url.split('?')[0];
	url += '?' + urlp.toString()
	window.location.href = url
}

// Counts the number of customers a given employee represents
function timesIn(value) {
    let count = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == value) {
            count++;
        }
    }
    return count;
}

// Hashes a string to generate a unique color
function strToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

//checks if search matches for a specific field
function checkField(field, name, customer, city, state, country, key){
	if(field == 'name'){
		return name.toLowerCase().includes(searchKey)
	} else if(field == 'customer'){
		return customer.toLowerCase().includes(searchKey)
	} else if(field == 'city'){
		return city.toLowerCase().includes(searchKey)
	} else if(field == 'state'){
		return state.toLowerCase().includes(searchKey)
	} else {
		return country.toLowerCase().includes(searchKey)
	}
}

//Performs the inital load of the map when loading the site
function initialMapLoad(data){
	loadkeys()
	initSearch()
    L.mapquest.key = key;

    // 'map' refers to a <div> element with the ID map
    map = L.mapquest.map('map', {
        center: [39, -96],
        layers: L.mapquest.tileLayer('map'),
        zoom: 4
    });
    layer = L.layerGroup().addTo(map);
	
    for (let i = 0; i < data.length; i++) {
        // Stores each item in current customer array in its own variable
        let name = data[i][0];
        let customer = data[i][1];
        let city = data[i][2];
        let state = data[i][3];
        let country = data[i][4];
		
		const urlp = new URLSearchParams(window.location.search)
		var type = 'and'
		var field = 'all'
		
		if(urlp.has('type')){
			type = urlp.get('type')
		}
		if(urlp.has('field')){
			field = urlp.get('field')
		}
		
		pass = true
		
		if(type == 'and'){
			pass = true
			for(let i = 0; i < keys.length; i++){
				searchKey = keys[i].toLowerCase()
				if(field == 'all'){
					if(!(name.toLowerCase().includes(searchKey) || customer.toLowerCase().includes(searchKey) || city.toLowerCase().includes(searchKey) || state.toLowerCase().includes(searchKey) || country.toLowerCase().includes(searchKey))){
						pass = false
					}
				} else {
					if(!checkField(field, name, customer, city, state, country, searchKey)){
						pass = false
					}
				}
			}
		} else {
			pass = false
			for(let i = 0; i < keys.length; i++){
				searchKey = keys[i].toLowerCase()
				if(field == 'all'){
					if((name.toLowerCase().includes(searchKey) || customer.toLowerCase().includes(searchKey) || city.toLowerCase().includes(searchKey) || state.toLowerCase().includes(searchKey) || country.toLowerCase().includes(searchKey))){
						pass = true
					}
				} else {
					if(checkField(field, name, customer, city, state, country, searchKey)){
						pass = true
					}
				}
			}
		}
		if(pass || !urlp.has('search')){		
			// Adds employee name to array of unique employee names (if not already added)
			if (!nameUnique.includes(name)) {
				nameUnique.push(name);
			}

			// Fetches location data from MapQuest
			getCoor(city, state, name, customer).then(fromData => {
				let latLng = fromData[0].results[0].locations[0].displayLatLng;
				let marker = L.marker([latLng.lat, latLng.lng], {
					text: fromData[1],
					subtext: fromData[2],
					position: 'down',
					type: 'marker',
					icon: L.mapquest.icons.marker({
						primaryColor: strToColor(fromData[1]),
						secondaryColor: strToColor(fromData[0].results[0].providedLocation.location),
						size: 'sm'
					})
				}).addTo(layer);
				 // Assign a popup with customer's information to appear above customer's map marker on click
				 let popupContent = '<div>' + city + ', ' + state + '</div><div>' + latLng.lat + ', ' + latLng.lng + '</div><div>' + customer + '</div><div>' + name + '</div>';
				 marker.bindPopup(popupContent).openPopup();
			});
		}
    }

	nameUniqueOrdered.push([nameUnique[0], timesIn([nameUnique[0]])])
    for (let i = 1; i < nameUnique.length; i++) {
        let count = timesIn(nameUnique[i]);

        for (let j = 0; j < nameUniqueOrdered.length; j++) {
            if (count >= nameUniqueOrdered[j][1]) {
                nameUniqueOrdered.splice(j, 0, [nameUnique[i], count]);
                break;
            } else if (j == nameUniqueOrdered.length - 1) {		
                nameUniqueOrdered.push([nameUnique[i], count]);
                break;
            }
        }

    }
	if(nameUnique.length == 0){
		document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding-left: 2px; font-size: 15px; border-style: solid; border-color: black;">No Results</div>';
	} else {
		for (let i = 0; i < nameUniqueOrdered.length; i++) {
			document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding-left: 2px; font-size: 15px; border-style: solid; border-color: ' + strToColor(nameUniqueOrdered[i][0]) + ';">' + nameUniqueOrdered[i][0] + ' (' + nameUniqueOrdered[i][1] + ') </div>';
		}
	}
}

//Loads results of filter into the map
function loadIntoMap(people){
    //Reset values
    var nameUnique = [];
    nameUniqueOrdered = [
     [nameUnique[0], timesIn(nameUnique[0])]
    ];
    layer.clearLayers();
    layer = L.layerGroup().addTo(map);
    for (let i = 0; i < people.length; i++) {
        let name = people[i][0];
        let customer = people[i][1];
        let city = people[i][2];
        let state = people[i][3];
        let country = people[i][4];

        if (!nameUnique.includes(name)) {
            nameUnique.push(name);
        }

        getCoor(city, state, name, customer).then(fromData => {
            let latLng = fromData[0].results[0].locations[0].displayLatLng;

            // Adds customer marker to map with returned info
            let marker = L.mapquest.textMarker([latLng.lat, latLng.lng], {
                text: fromData[1],
                subtext: fromData[2],
                position: 'down',
                type: 'marker',
                icon: L.mapquest.icons.marker({
                    primaryColor: strToColor(fromData[1]),
                    secondaryColor: strToColor(fromData[0].results[0].providedLocation.location),
                    size: 'sm'
                })
            }).addTo(layer);

             // Assign a popup with customer's information to appear above customer's map marker on click
             let popupContent = '<div>' + city + ', ' + state + '</div><div>' + latLng.lat + ', ' + latLng.lng + '</div><div>' + customer + '</div><div>' + name + '</div>';
             marker.bindPopup(popupContent).openPopup();
        });
    }

    // Sorts nameUnique into nameUniqueOrdered for printing in alphabetical order
    for (let i = 1; i < nameUnique.length; i++) {
        let count = timesIn(nameUnique[i]);

        for (let j = 0; j < nameUniqueOrdered.length; j++) {
            if (count >= nameUniqueOrdered[j][1]) {
                nameUniqueOrdered.splice(j, 0, [nameUnique[i], count]);
                break;
            } else if (j == nameUniqueOrdered.length - 1) {
                nameUniqueOrdered.push([nameUnique[i], count]);
                break;
            }
        }

    }

    // Add all employees and their customer count to the info bar on the left of the map
    for (let i = 0; i < nameUniqueOrdered.length; i++) {
        document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding-left: 2px; font-size: 15px; border-style: solid; border-color: ' + strToColor(nameUniqueOrdered[i][0]) + ';">' + nameUniqueOrdered[i][0] + ' (' + nameUniqueOrdered[i][1] + ') </div>';
    }
}

document.addEventListener("DOMContentLoaded", function() {  initialMapLoad(data)});