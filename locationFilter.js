/*
This js file is used to provide location filter functionality
*/

var filteredPeople = [];
async function filterPeople(selectedReigon, data){
    filteredPeople.length = 0;
    for(i = 0; i < data.length; i++){
        let reigon = data[i][4];
        if(reigon == selectedReigon){
            filteredPeople.push(data[i]);
        }
    }
}


function filter(location, data){
    if(location == "All"){
        window.location.reload();
    }
    filterPeople(location,data);
    document.getElementById("people").innerHTML= " ";
    document.getElementById("customers").innerHTML = " ";
    loadIntoMap(filteredPeople);   
  
}