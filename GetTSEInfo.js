GetTSEListURL = "https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetTSEList.php";
GetCustomerSummaryURL = "https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetCustomerList.php"

//Takes a name and returns a json list with their information from the Summary table
function getTSEList(){
    $.ajax({
        method: 'get',
        url: GetTSEListURL,
        success: function (z) {
            TSEdata = JSON.parse(z);
            loadTSEmap(TSEdata);
        }
    });
}

function loadTSEmap(d){
    /*
    * 0 = TSE
    * 1 = City
    * 2 = State
    */
   for (let i = 0; i < TSEdata.length; i++) {
    // Stores each item in current customer array in its own variable
    let TSE = TSEdata[i][0].trim();
    let city = TSEdata[i][1].trim();
    let state = TSEdata[i][2].trim();
    latitdude = TSEdata[i][4];
    longtitude = TSEdata[i][4];	
        // Fetches location data from MapQuest
        if(latitdude === null || longtitude===null){ //If we don't have location coordinates call getCoor
        getCoor(city, state, TSE,).then(fromData => {
            let latLng = fromData[0].results[0].locations[0].displayLatLng;
            latitdude = latLng.lat;
            longtitude = latLng.lng;
            let marker = L.marker([latitdude, longtitude], {
                text: name,
                subtext: city,
                position: 'down',
                type: 'marker',
                icon: L.mapquest.icons.marker({
                    primaryColor: strToColor(TSE),
                    secondaryColor: '#000000',
                    size: 'sm'
                })
            })
            TSEMarkers.push(marker);
        });
    } else {//if we have coordinates use our stored coordinates
        latitdude= parseFloat(latitdude);
        longtitude = parseFloat(longtitude);
        let marker = L.marker([latitdude, longtitude], {
            text: name,
            subtext: city,
            position: 'down',
            type: 'marker',
            icon: L.mapquest.icons.marker({
                primaryColor: strToColor(TSE),
                secondaryColor: '#000000',
                size: 'sm'
            })
        })
        TSEMarkers.push(marker);
    }
   } TSEMarkers.forEach(marker => {
        marker.addTo(TSElayer);
    });
}



function getCustomerList(){
    $.ajax({
        method:'get',
        url: GetCustomerSummaryURL,
        success: function(z){
            data = JSON.parse(z);
            initialMapLoad(data);
        }
    })
}