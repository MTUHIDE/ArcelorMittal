<?php
//This file is used to allow php to read from XSLX, source can be found here https://github.com/shuchkin/simplexlsx
include (__DIR__.'/SimpleXLSX.php');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

if (isset($_FILES['Data'])) {
    // echo $_FILES['Data'];
    // echo $_FILES['Data']['tmp_name'];
    move_uploaded_file($_FILES['Data']['tmp_name'], "uploads/".$_FILES['Data']['name']);
    $fileName = $_FILES['Data']['name'];
    echo "Uploaded";
    connectToDB($fileName);
} else{
    echo "Failed upload";
}


function connectToDB($fileName){
// Uncomment and insert credentials here   
$username = "mtsayles";
$password = "343Guiltyspark";
//Connect to database


$servername = "classdb.it.mtu.edu";
try{
    $conn = new PDO("mysql:host=$servername;port=3307; dbname=arcelormittal", $username,
    $password);
    $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    ReadData($conn,$fileName);
} catch (PDOException $e){
    echo "Connection failed:" . $e->getMessage();
}
}
function ReadData($conn,$fileName){
if( $xlsx = SimpleXLSX::parse('uploads/'.$fileName)){
    //Remove current data in DB
    $insertData = $conn->prepare("SET SQL_SAFE_UPDATES=0;
    Delete from CustomerList where Latitude is Null;
    SET SQL_SAFE_UPDATES=1;");
    $insertData->execute();

    $currentRow = 0;
    foreach ( $xlsx->rows() as $r => $row ) {
        $data = array();//Arrary to hold the values of a row
        if($currentRow != 0){
            foreach ( $row as $c => $cell ) {
                if($cell != ""){
                    //echo $cell;
                //Makes sure empty cells are not added to array
                    array_push($data,$cell);
                }
            }
        //Insert the row into the database
        /* Values in array and their corresponding data
        * 0 = Customer
        * 1 = City
        * 2 = State
        * 3 = TSE
        * 4 = Region
        */ 
        //insert row into database
            try{
                $insertData = $conn->prepare("Insert CustomerList (Customer, City, St, TSE, Region) values (?,?,?,?,?)");
                $insertData->execute($data);
            } catch(PDOException $e){
                echo "Error".$e->getMessage();
            } 
        }
        //echo count($data);
    $currentRow++;
    }
} else {
    echo SimpleXLSX::parseError();
}
}


?>