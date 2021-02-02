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

let nameUnique = [];
nameUniqueOrdered = [
    [nameUnique[0], timesIn(nameUnique[0])]
];

// Gets coordinates of given city/state
// Returns MapQuest response, employee name, and customer name
async function getCoor(city, state, name, customer) {
    let response = await fetch('http://www.mapquestapi.com/geocoding/v1/address?key=' + key + '&location=' + city + "," + state);
    let data = await response.json()
    return [data, name, customer];
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

// Performs all inner actions once the HTML page is loaded
document.addEventListener("DOMContentLoaded", function() {
    L.mapquest.key = key;

    // 'map' refers to a <div> element with the ID map
    const map = L.mapquest.map('map', {
        center: [39, -96],
        layers: L.mapquest.tileLayer('map'),
        zoom: 4
    });

    for (let i = 0; i < data.length; i++) {
        // Stores each item in current customer array in its own variable
        let name = data[i][0];
        let customer = data[i][1];
        let city = data[i][2];
        let state = data[i][3];
        let country = data[i][4];

        // Adds employee name to array of unique employee names (if not already added)
        if (!nameUnique.includes(name)) {
            nameUnique.push(name);
        }

        // Fetches location data from MapQuest
        getCoor(city, state, name, customer).then(fromData => {
            let latLng = fromData[0].results[0].locations[0].displayLatLng;

            // Adds customer marker to map with returned info
            L.mapquest.textMarker([latLng.lat, latLng.lng], {
                text: fromData[1],
                subtext: fromData[2],
                position: 'down',
                type: 'marker',
                icon: {
                    primaryColor: strToColor(fromData[1]),
                    secondaryColor: strToColor(fromData[0].results[0].providedLocation.location),
                    size: 'sm'
                }
            }).addTo(map);
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
});