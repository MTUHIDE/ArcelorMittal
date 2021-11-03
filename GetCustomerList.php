<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

function debug_to_console($data) {
    // $output = $data;
    // if (is_array($output))
    //     $output = implode(',', $output);

    // echo json_encode($output);
    $arr = array('a' => 1, 'b' => 2, 'c' => 3, 'd' => 4, 'e' => 5);
    echo json_encode($arr);
}

$servername = "classdb.it.mtu.edu";
/* Uncomment and insert credentials here*/
$myfile = fopen("https://classdb.it.mtu.edu/cs3141/ArcelorMittal/login.txt", "r") or die("Unable to open file!");
$username = fgets($myfile);
debug_to_console($username);
$password = fgets($myfile);
debug_to_console($password);
fclose($myfile);
$username = "arcelormittal_rw";
$password = "";

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

?>
