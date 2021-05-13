GetTSEListURL = 'https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetTSEList.php';
GetCustomerSummaryURL = 'https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetCustomerList.php';

//Takes a name and returns a json list with their information from the Summary table
function getTSEList(tkeys) {
	$.ajax({
		method: 'get',
		url: GetTSEListURL,
		success: function (z) {
			TSEdata = JSON.parse(z);
			loadTSEmap(TSEdata, tkeys);
		},
	});
}

function loadTSEmap(d, tkeys) {
	let tpass;
	let tsearchKey;

    TSElayer = L.layerGroup();
	/*
	 * 0 = TSE
	 * 1 = City
	 * 2 = State
	 */
	for (let i = 0; i < TSEdata.length; i++) {
		let arr = TSEdata[i][0].split(", ");
		let fullName = arr[1] + " " + arr[0];

		if(type == 'and'){
			tpass = true;
			for(let j = 0; j < tkeys.length; j++){
				tsearchKey = tkeys[j].toLowerCase();
				if(field == 'all' || field == 'name'){
					if(!(fullName.toLowerCase().trim().includes(tsearchKey))){
						tpass = false;
					}
				}
			}
		} else {
			tpass = false;
			for(let j = 0; j < tkeys.length; j++){
				tsearchKey = tkeys[j].toLowerCase().trim();
				if(field == 'all' || field == 'name'){
					if((fullName.toLowerCase().trim().includes(tsearchKey))){
						tpass = true;
					}
				}
			}
		}

		if(tpass){
			// Stores each item in current customer array in its own variable
			let TSE = TSEdata[i][0].trim();
			let city = TSEdata[i][1].trim();
			let state = TSEdata[i][2].trim();
			latitude = TSEdata[i][4];
			longitude = TSEdata[i][4];
			let popupContent = '<div style="font-size: 14px;"><div><b>TSE Name: </b>' + TSE + '</div></div>';

			// Fetches location data from MapQuest
			if (latitude === null || longitude === null) {
				//If we don't have location coordinates call getCoor
				getCoor(city, state, TSE).then((fromData) => {
					let latLng = fromData[0].results[0].locations[0].displayLatLng;
					latitude = latLng.lat;
					longitude = latLng.lng;
					marker = L.marker([latitude, longitude], {
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
				longitude = parseFloat(longitude);
				marker = L.marker([latitude, longitude], {
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

			TSEOrdered.push(fullName);
			TSEOrdered.sort();
		}
		
	}

	if(TSEOrdered.length == 0)
		document.getElementById("people").innerHTML += '<div style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: black;">No Results</div>';
	else {
		for(let i = 0; i < TSEOrdered.length; i++){
			document.getElementById("people").innerHTML += '<div class="subpeople" onclick="addTSEFilter(\'' + TSEOrdered[i] + '\')" style="margin: 5px; padding: 4px; padding-left: 5px; font-size: 16px; border-style: solid; border-width: 4px; border-radius: 7px; border-color: ' + strToColor(TSEOrdered[i]) + ';">' + TSEOrdered[i] + '<span style="float: right">(' + timesIn(TSEOrdered[i]) + ')</span></div>';
		}
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
