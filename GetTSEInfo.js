GetTSEListURL = 'https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetTSEList.php';
GetCustomerSummaryURL = 'https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetCustomerList.php';

//Takes a name and returns a json list with their information from the Summary table
function getTSEList() {
	$.ajax({
		method: 'get',
		url: GetTSEListURL,
		success: function (z) {
			TSEdata = JSON.parse(z);
			loadTSEmap(TSEdata);
		},
	});
}

function loadTSEmap(d) {
    TSElayer = L.layerGroup();
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
		latitude = TSEdata[i][4];
		longtitude = TSEdata[i][4];
        let popupContent = '<div style="font-size: 14px;"><div><b>TSE Name: </b>' + TSE + '</div></div>';
		// Fetches location data from MapQuest
		if (latitude === null || longtitude === null) {
			//If we don't have location coordinates call getCoor
			getCoor(city, state, TSE).then((fromData) => {
				let latLng = fromData[0].results[0].locations[0].displayLatLng;
				latitude = latLng.lat;
				longtitude = latLng.lng;
				marker = L.marker([latitude, longtitude], {
					text: name,
					subtext: city,
					position: 'down',
					type: 'marker',
					icon: L.mapquest.icons.marker({
						primaryColor: strToColor(TSE),
						secondaryColor: '#000000',
						size: 'sm',
					}),
				}).bindPopup(popupContent).openPopup().addTo(TSElayer);
			});
		} else {
			//if we have coordinates use our stored coordinates
			latitude = parseFloat(latitude);
			longtitude = parseFloat(longtitude);
			marker = L.marker([latitude, longtitude], {
				text: name,
				subtext: city,
				position: 'down',
				type: 'marker',
				icon: L.mapquest.icons.marker({
					primaryColor: strToColor(TSE),
					secondaryColor: '#000000',
					size: 'sm',
				}),
			}).bindPopup(popupContent).openPopup().addTo(TSElayer);
		}
	}

	TSEdata.forEach(element => {
		let arr = element[0].split(", ");
		let name = arr[1] + " " + arr[0];
		TSEOrdered.push(name);
	});
	TSEOrdered.sort();

	for(let i = 0; i < TSEOrdered.length; i++){
		document.getElementById("people").innerHTML += '<div class="subpeople" onclick="addTSEFilter(\'' + TSEOrdered[i] + '\')" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(TSEOrdered[i]) + ';">' + TSEOrdered[i] + '<span style="float: right">(' + timesIn(TSEOrdered[i]) + ')</span></div>';
	}
}

function getCustomerList() {
	$.ajax({
		method: 'get',
		url: GetCustomerSummaryURL,
		success: function (z) {
			data = JSON.parse(z);
			initialMapLoad(data);
		},
	});
}
