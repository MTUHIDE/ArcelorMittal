<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$servername = "classdb.it.mtu.edu";
/* Uncomment and insert credentials here
$username = 
$password = 
*/
try{
    $conn = new PDO("mysql:host=$servername;port=3307; dbname=arcelormittal", $username,
    $password);
    $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if(isset($_GET['t'])){
        getTSEInfo($_GET['t'], $conn);
    } 
} catch (PDOException $e){
    echo "Connection failed:" . $e->getMessage();
}

function getTSEInfo($TESName, PDO $conn){
    try{
        $getInfo = $conn->prepare("Select * from TSENameListing where TSEName = ?");
        $getInfo->execute([$TESName]);
        //Fetch Result
        $user = $getInfo -> fetch();
        $result = array();
        //Return json list with results
        array_push($result, $user);
        echo json_encode($result);
    } catch (PDOException $e){
        echo "Error: " . $e->getMessage();
    }
    $conn =null;
}


