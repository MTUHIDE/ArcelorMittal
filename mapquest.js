// Temporary mock customer data
var data;

// MapQuest API key
const key = "Ao6wUe2zwTFeXVlE6kSxwDxVwM1My2Fu";

var nameUnique = [];
var nameUniqueOrdered = [];
var map;
var featureGroup;
var layer;
var keys = [];
var types = ['and', 'or']
var fields = ['all', 'name', 'customer', 'city', 'state', 'country']

// Switches from Customers tab to TSEs tab
const switchToTSE = () => {
	document.getElementById("people").classList.remove("hidden");
	document.getElementById("customers").classList.add("hidden");
	document.getElementById("tse-button").classList.add("selected-tab");
	document.getElementById("customer-button").classList.remove("selected-tab");
}

// Switches from TSEs tab to Customers tab
const switchToCustomers = () => {
	document.getElementById("people").classList.add("hidden");
	document.getElementById("customers").classList.remove("hidden");
	document.getElementById("tse-button").classList.remove("selected-tab");
	document.getElementById("customer-button").classList.add("selected-tab");
}

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
	document.getElementById("searchType").innerHTML += '<option class="select-items" value='+types[index]+'>'+types[index]+'</option>'
	for(let i = 0; i < types.length; i++){
		if(i != index){
			document.getElementById("searchType").innerHTML += '<option class="select-items" value='+types[i]+'>'+types[i]+'</option>'
		}
	}
	
	index = 0
	if(urlp.has('field')){
		index = fields.indexOf(urlp.get('field'))
	}
	document.getElementById("searchField").innerHTML += '<option class="select-items" value='+fields[index]+'>'+fields[index]+'</option>'
	for(let i = 0; i < fields.length; i++){
		if(i != index){
			document.getElementById("searchField").innerHTML += '<option class="select-items" value='+fields[i]+'>'+fields[i]+'</option>'
		}
	}
}

function removeKey(key){
	key = key.replace("+", " ")
	var newParams = ""
	for(var i = 0; i < keys.length; i++){
		if(keys[i] != key){
			newParams += keys[i] + "*"
		}	
	}
	newParams = newParams.substring(0, newParams.length-1)
	const urlp = new URLSearchParams(window.location.search)
	var search = urlp.set('search', newParams)
	window.location.href = "?" + urlp.toString()
}

//load keys from url
function loadkeys(){
	const urlp = new URLSearchParams(window.location.search)
	var search = urlp.get('search')
	if(search){
		urlKeysParsed = search.split('*')
		for(let i = 0; i < urlKeysParsed.length; i++){
			keys.push(urlKeysParsed[i])
			nonSpace = urlKeysParsed[i].replace(" ", "+")
			document.getElementById("keys").innerHTML += "<div class='keys'>" + urlKeysParsed[i] + "<button onclick=removeKey('" + nonSpace + "') class='xbutton' >&times</button></div>"
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
		if(search.length != 0){
			search += "*"
		}
		search += newKey
		urlp.set('search', search)
	} else {
		urlp.append('search', newKey)
	}
	window.location.href = "?" + urlp.toString()
}

//add new keyword
function addKeyWord(){
	newKey = document.getElementById("search").value
	if(newKey.length == 0){
		return
	}
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
        if (data[i][3].trim() == value) {
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

// Allows map to center on a single customer marker
let navigationControl;
function centerMap(lat, lng) {
	navigationControl._center = L.latLng(lat, lng);
	navigationControl._zoom = 11;
	document.getElementsByClassName("leaflet-control-mapquest-navigation-reset")[0].click();
}

// Adds a search for the name of clicked TSE
function addTSEFilter(index) {
	tseName = nameUniqueOrdered[index][0];
	keys.push(tseName)
	reload(tseName)
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
	navigationControl = L.mapquest.navigationControl();
	map.addControl(navigationControl);
    
    for (let i = 0; i < data.length; i++) {
        // Stores each item in current customer array in its own variable
        let name = data[i][3].trim();
        let customer = data[i][0].trim();
        let city = data[i][1].trim();
		let state = data[i][2].trim();
		//latitdude = data[i][7];
		//longtitude = data[i][8];
        let country = "United States";
		
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
			if(data[i][7] === null || data[i][8]===null){ //If we don't have location coordinates call getCoor
			getCoor(city, state, name, customer).then(fromData => {
				let latLng = fromData[0].results[0].locations[0].displayLatLng;
				data[i][7] = latLng.lat;
				data[i][8] = latLng.lng;
				let marker = L.marker([data[i][7], data[i][8]], {
					text: name,
					subtext: city,
					position: 'down',
					type: 'marker',
					icon: L.mapquest.icons.marker({
						primaryColor: strToColor(name),
						secondaryColor: '#000000',
						size: 'sm'
					})
				}).addTo(layer);
				 // Assign a popup with customer's information to appear above customer's map marker on click
				 let popupContent = '<div style="font-size: 14px;"><div><b>Location: </b>' + city + ', ' + state + '</div><div><b>TSE: </b>' + name + '</div><div><b>Customer:</b> ' + customer + '</div></div>';
				 marker.bindPopup(popupContent).openPopup();

				 // Adds clickable customer entry in leftbar list
				 document.getElementById("customers").innerHTML += '<div class="subcustomer" onclick="centerMap(' + latLng.lat + ', ' + latLng.lng + ')" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(name) + ';">' + data[i][0] + '</div>';
			});
		} else {//if we have coordinates use our stored coordinates
			data[i][7]= parseFloat(data[i][7]);
			data[i][8] = parseFloat(data[i][8]);
			let marker = L.marker([data[i][7], data[i][8]], {
				text: name,
				subtext: city,
				position: 'down',
				type: 'marker',
				icon: L.mapquest.icons.marker({
					primaryColor: strToColor(name),
					secondaryColor: '#000000',
					size: 'sm'
				})
			}).addTo(layer);
			 // Assign a popup with customer's information to appear above customer's map marker on click
			 let popupContent = '<div style="font-size: 14px;"><div><b>Location: </b>' + city + ', ' + state + '</div><div><b>TSE: </b>' + name + '</div><div><b>Customer:</b> ' + customer + '</div></div>';
			 marker.bindPopup(popupContent).openPopup();

			 // Adds clickable customer entry in leftbar list
			 document.getElementById("customers").innerHTML += '<div class="subcustomer" onclick="centerMap(' + data[i][7] + ', ' + data[i][8] + ')" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(name) + ';">' + data[i][0] + '</div>';

		}
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
		document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: black;">No Results</div>';
	} else {
		for (let i = 0; i < nameUniqueOrdered.length; i++) {
			document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(nameUniqueOrdered[i][0]) + ';">' + nameUniqueOrdered[i][0] + '<span style="float: right">(' + nameUniqueOrdered[i][1] + ')</span></div>';
		}
	}
}




//Loads results of filter into the map
function loadIntoMap(people){
    //Reset values
    nameUnique = [people[0]];
    nameUniqueOrdered = [
     [nameUnique[0], timesIn(nameUnique[0])]
    ];
    layer.clearLayers();
    layer = L.layerGroup().addTo(map);
    for (let i = 0; i < people.length; i++) {
        let name = data[i][3];
        let customer = data[i][0];
        let city = data[i][1];
        let state = data[i][2];
        let country = "United States";

        if (!nameUnique.includes(name)) {
            nameUnique.push(name);
        }

        getCoor(city, state, name, customer).then(fromData => {
            let latLng = fromData[0].results[0].locations[0].displayLatLng;

            // Adds customer marker to map with returned info
            let marker = L.marker([latLng.lat, latLng.lng], {
                text: fromData[1],
                subtext: fromData[2],
                position: 'down',
                type: 'marker',
                icon: L.mapquest.icons.marker({
                    primaryColor: strToColor(fromData[1]),
                    secondaryColor: '#000000',
                    size: 'sm'
                })
            }).addTo(layer);

             // Assign a popup with customer's information to appear above customer's map marker on click
             let popupContent = '<div style="font-size: 14px;"><div><b>Location: </b>' + city + ', ' + state + '</div><div><b>TSE: </b>' + name + '</div><div><b>Customer:</b> ' + customer + '</div></div>';
             marker.bindPopup(popupContent).openPopup();

			 // Adds clickable customer entry in leftbar list
			 document.getElementById("customers").innerHTML += '<div class="subcustomer" onclick="centerMap(' + latLng.lat + ', ' + latLng.lng + ')" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(name) + ';">' + data[i][0] + '</div>';
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
        document.getElementById("people").innerHTML += '<div class="subpeople" onclick="addTSEFilter(' + nameUniqueOrdered[i][0] + ')" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(nameUniqueOrdered[i][0]) + ';">' + nameUniqueOrdered[i][0] + '<span style="float: right">(' + nameUniqueOrdered[i][1] + ')</span></div>';
    }
}

document.addEventListener("DOMContentLoaded", function() {  getCustomerList()});
