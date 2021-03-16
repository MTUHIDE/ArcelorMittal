<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$servername = "classdb.it.mtu.edu";
/* Uncomment and insert credentials here*/
$username = "mtsayles";
$password = "343Guiltyspark";

try{
    $conn = new PDO("mysql:host=$servername;port=3307; dbname=arcelormittal", $username,
    $password);
    $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if(isset($_GET['t'])){
        getTSEInfo($_GET['t'], $conn);
    } else {
        getAllInfo($conn);
    }
} catch (PDOException $e){
    echo "Connection failed:" . $e->getMessage();
}

function getTSEInfo($TESName, PDO $conn){
    try{
        $result = array();
        $getInfo = $conn->prepare("Select * from CustomerList where TSE = ?");
        $getInfo->execute([$TESName]);
        //Fetch Result
        $customers = $getInfo -> fetchAll();
        //Return json list with results
        array_push($result, $customers);
        echo json_encode($result);
    } catch (PDOException $e){
        echo "Error: " . $e->getMessage();
    }
    $conn =null;
}
function getAllInfo(PDO $conn){
    try{
    $getInfo = $conn->prepare("Select * from CustomerList");
        $getInfo->execute();
        //Fetch Result
        $customers = $getInfo -> fetchAll();
        //Return json list with results
        echo json_encode($customers);
    } catch (PDOException $e){
        echo "Error: " . $e->getMessage();
    }
    $conn =null;
}


