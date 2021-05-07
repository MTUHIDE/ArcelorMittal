<?php
require (__DIR__.'/password.php');//Allow php 5.4 compatability with password_hash function provided in php 5.5>=, https://github.com/ircmaxell/password_compat
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");


if(isset($_POST['username']) && isset($_POST['password'])){
    login($_POST['username'], $_POST['password']);
} else {
    echo "Login failed";
}


function login($username,$password){
    //Connect to Database
    $u = "mtsayles";
    $p = "343Guiltyspark";
    $servername = "classdb.it.mtu.edu";
    try{
        $conn = new PDO("mysql:host=$servername;port=3307; dbname=arcelormittal", $u,
        $p);
        $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //$hashedPassword = password_hash($password,PASSWORD_DEFAULT);
        $login = $conn->prepare("SELECT password FROM login WHERE username = ?");
        $login->execute([$username]);
        $returnedPassword = $login-> fetchColumn();
        $results = array("username"=>$username, "password"=>$returnedPassword);
        if(password_verify($password, $returnedPassword)){
            echo json_encode($results);
        } else {
            echo json_encode("false");
        }
    } catch (PDOException $e){
        echo "Connection failed:" . $e->getMessage();
    }

}


?>