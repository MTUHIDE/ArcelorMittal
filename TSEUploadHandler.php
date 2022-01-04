<?php
    require 'vendor/autoload.php';
    use PhpOffice\PhpSpreadsheet\Spreadsheet;
    use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

    // Move uploaded file into 'uploads' folder
    if (isset($_FILES['Data'])) {
        move_uploaded_file($_FILES['Data']['tmp_name'], "uploads/".$_FILES['Data']['name']);
        $fileName = $_FILES['Data']['name'];
        echo "Uploaded";
        connectToDB($fileName);
    } else{
        echo "Failed upload";
    }

    function connectToDB($fileName){
        //Connect to database
        $servername = "localhost";
        $username = "arcelormittal_arcelormittal";
        
        $myfile = fopen("login.txt", "r") or die("Unable to open file!");
        $password = fgets($myfile,filesize("login.txt") + 1);
        fclose($myfile);
        
        try{
            $conn = new PDO("mysql:host=$servername; dbname=arcelormittal_arcelormittal", $username,
            $password);
            $conn -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            ClearTable($conn);
            ReadData($conn,$fileName);
        } catch (PDOException $e){
            echo "Connection failed:" . $e->getMessage();
        }
    }

    function ClearTable($conn) {
        try{
            $getInfo = $conn->prepare("DELETE FROM TSELocations");
            $getInfo->execute();
        } catch (PDOException $e){
            echo "Error: " . $e->getMessage();
        }
    }

    function ReadData($conn,$fileName){
        // Get the spreadsheet from the uploads folder
        $filePath = "uploads/" . $fileName;
        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($filePath);

        // Select the sheet TSEInfo from the spreadsheet
        $spreadsheet -> setActiveSheetIndexByName("TSEInfo");

        // Find the number of rows in the sheet
        $rows = $spreadsheet -> getActiveSheet() -> getHighestDataRow();

        // Select a cell range from within the sheet
        $dataArray = $spreadsheet -> getActiveSheet()
            -> rangeToArray(
                'A4:A'.($rows - 6),
                NULL,
                FALSE,
                FALSE,
                FALSE
            );

        // Iterate through rows containing data
        for($row = 0; $row <= $rows - 10; $row++) {
            $data = array();

            // TSE
            array_push($data, $dataArray[$row][0]);
            // City
            array_push($data, NULL);
            // State
            array_push($data, NULL);
            // Latitude
            array_push($data, NULL);
            // Longitude
            array_push($data, NULL);

            // Insert into database
            try{
                $insertData = $conn->prepare("Insert TSELocations (TSE, City, State, Latitude, Longitude) values (?,?,?,?,?)");
                $insertData->execute($data);
            } catch(PDOException $e){
                throw new Error($e->getMessage());
            }
        }
    }
?>