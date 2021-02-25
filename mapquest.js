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

// Gets coordinates of given city/state
// Returns MapQuest response, employee name, and customer name
async function getCoor(city, state, name, customer) {
    let response = await fetch('http://www.mapquestapi.com/geocoding/v1/address?key=' + key + '&location=' + city + "," + state);
    let data = await response.json()
    return [data, name, customer];
}

function reset(){
	var url = window.location.href;
    url = url.split('?')[0];
	location.href=url
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

//Performs the inital load of the map when loading the site
function initialMapLoad(data){
    L.mapquest.key = key;

    // 'map' refers to a <div> element with the ID map
    map = L.mapquest.map('map', {
        center: [39, -96],
        layers: L.mapquest.tileLayer('map'),
        zoom: 4
    });
	const queryString = window.location.search;
	const url = new URLSearchParams(queryString)
	try{
		searchKey = url.get("search").toLowerCase()
	}catch(error){
		searchKey = null
	}
    layer = L.layerGroup().addTo(map);
	
    for (let i = 0; i < data.length; i++) {
        // Stores each item in current customer array in its own variable
        let name = data[i][0];
        let customer = data[i][1];
        let city = data[i][2];
        let state = data[i][3];
        let country = data[i][4];
		
		if((searchKey == null) || (name.toLowerCase().includes(searchKey) || customer.toLowerCase().includes(searchKey) || city.toLowerCase().includes(searchKey) || state.toLowerCase().includes(searchKey) || country.toLowerCase().includes(searchKey))){		
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
						secondaryColor: '#000000',
						size: 'sm'
					})
				}).addTo(layer);
				 // Assign a popup with customer's information to appear above customer's map marker on click
				 let popupContent = '<div style="font-size: 14px;"><div><b>Location: </b>' + city + ', ' + state + '</div><div><b>TSE: </b>' + name + '</div><div><b>Customer:</b> ' + customer + '</div></div>';
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
    for (let i = 0; i < nameUniqueOrdered.length; i++) {
        document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(nameUniqueOrdered[i][0]) + ';">' + nameUniqueOrdered[i][0] + '<span style="float: right">(' + nameUniqueOrdered[i][1] + ')</span></div>';
    }
}

//Loads results of filter into the map
function loadIntoMap(people){
    //Reset values 
    console.log(people);
    nameUnique = [];
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
                    secondaryColor: '#000000',
                    size: 'sm'
                })
            }).addTo(layer);

             // Assign a popup with customer's information to appear above customer's map marker on click
             let popupContent = '<div style="font-size: 14px;"><div><b>Location: </b>' + city + ', ' + state + '</div><div><b>TSE: </b>' + name + '</div><div><b>Customer:</b> ' + customer + '</div></div>';
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
        document.getElementById("people").innerHTML += '<div class="subpeople" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(nameUniqueOrdered[i][0]) + ';">' + nameUniqueOrdered[i][0] + '<span style="float: right">(' + nameUniqueOrdered[i][1] + ')</span></div>';
    }
}

document.addEventListener("DOMContentLoaded", function() {  initialMapLoad(data)});