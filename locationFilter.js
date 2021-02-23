/*
This js file is used to provide location filter functionality
*/

boundingBoxes=[
    {
        Location: "NorthEast",
        NWPoint:{
            lat: 48,
            long: -80
        },
        SEPoint:{
            lat:37,
            long:-66
        }
    },
    {
        Location: "Midwest",
        NWPoint:{
            lat: 49,
            long: -117
        },
        SEPoint:{
            lat:36,
            long:-81
        }
    },
    {
        Location: "Southern",
        NWPoint:{
            lat: 36,
            long: -116
        },
        SEPoint:{
            lat:24,
            long:-75
        }
    },
    {
        Location: "Western",
        NWPoint:{
            lat: 49,
            long: -125
        },
        SEPoint:{
            lat:32,
            long:-114
        }
    },
    {
        Location: "Canada",
        NWPoint:{
            lat: 60,
            long: -140
        },
        SEPoint:{
            lat:39,
            long:-49
        }
    },
    {
        Location: "Mexico",
        NWPoint:{
            lat: 32,
            long: -117,
        },
        SEPoint:{
            lat:13,
            long:-93
        }
    }
]

var filteredPeople = [];
async function filterPeople(box, data){
    filteredPeople = [];
    for(i = 0; i < data.length; i++){
        //Get persons details
        console.log(data[i]);
        let name = data[i][0];
        let customer = data[i][1];
        let city = data[i][2];
        let state = data[i][3];
        let country = data[i][4];

        await getCoor(city, state, name, customer).then( result => {
            //Check to see if the person is within the bounding box for the selected location
            let latLng = result[0].results[0].locations[0].displayLatLng;
            let latitude = latLng.lat;
            let longitude = latLng.lng;
            if((boundingBoxes[box].NWPoint.lat > latitude  && latitude > boundingBoxes[box].SEPoint.lat) && (boundingBoxes[box].NWPoint.long < longitude && longitude < boundingBoxes[box].SEPoint.long)){
                filteredPeople.push(data[i]);
            }
        });   
    }
}


function filter(location, data){
    let box;
    for(i=0; i < boundingBoxes.length; i++){
        if(boundingBoxes[i].Location == location){
        box = i;
        console.log(box);
        break;
        }
    }
    document.getElementById("people").innerHTML = "<div><p>Filtering....</p></div>"
    filterPeople(box,data).then( results => {
        console.log(filteredPeople);
        document.getElementById("people").innerHTML = " ";
        loadIntoMap(filteredPeople);//Load filtered people into map
    });
  
}