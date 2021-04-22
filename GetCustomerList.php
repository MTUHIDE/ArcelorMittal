<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

$servername = "classdb.it.mtu.edu";
/* Uncomment and insert credentials here*/
$username = "arcelormittal_ro";
$password = "password";

try{
    $conn = new PDO("mysql:host=$servername;port=3307; dbname=arcelormittal", $username,
    $password);
    $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    getAllInfo($conn);
} catch (PDOException $e){
    echo "Connection failed:" . $e->getMessage();
}

function getAllInfo(PDO $conn){
    try{
    $getInfo = $conn->prepare("SELECT DISTINCT a.Customer, a.City, a.St, a.TSE, a.Region, a.ID, b.LATITUDE, b.LONGITUDE
    FROM CustomerList AS a
    LEFT JOIN us_cities AS b
    ON LOWER(a.St) = LOWER(b.STATE_CODE)
    AND LOWER(a.City) = LOWER(b.CITY)
    GROUP BY a.Customer, a.St, a.City");
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


