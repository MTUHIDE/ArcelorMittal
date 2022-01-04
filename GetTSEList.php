<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$servername = "localhost";
$username = "arcelormittal_arcelormittal";

$myfile = fopen("login.txt", "r") or die("Unable to open file!");
$password = fgets($myfile,filesize("login.txt") + 1);
fclose($myfile);

try{
    $conn = new PDO("mysql:host=$servername; dbname=arcelormittal_arcelormittal", $username,
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


