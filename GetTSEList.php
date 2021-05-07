<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$servername = "classdb.it.mtu.edu";
$username = "arcelormittal_ro";
$password = "password";

try{
    $conn = new PDO("mysql:host=$servername;port=3307; dbname=arcelormittal", $username,
    $password);
    $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    getTSEInfo($conn);
} catch (PDOException $e){
    echo "Connection failed:" . $e->getMessage();
}

function getTSEInfo(PDO $conn){
    try{
        $getInfo = $conn->prepare("Select * from TSELocations");
        $getInfo->execute();
        //Fetch Result
        $TSEs = $getInfo->fetchAll();
        echo json_encode($TSEs);
    } catch (PDOException $e){
        echo "Error: " . $e->getMessage();
    }
    $conn =null;
}


