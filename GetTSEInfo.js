GetTSENameListingURL = "https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetTSENameListing.php?t=";
GetTSESummaryURL = "https://classdb.it.mtu.edu/cs3141/ArcelorMittal/GetTSESummary.php?t=";
TSEName = "Pavlosky, Richard J";
//Takes a name and returns a json list with their information from the Name Listing table
function getTSENameListingbyName(){
$.ajax({
    method: 'get',
    url: GetTSENameListingURL+TSEName,
    success: function (z) {
        console.log(z)
    }
});
}
//Takes a name and returns a json list with their information from the Summary table
function getTSESummarybyName(){
    $.ajax({
        method: 'get',
        url: GetTSESummaryURL+TSEName,
        success: function (z) {
            console.log(z)
        }
    });
    }