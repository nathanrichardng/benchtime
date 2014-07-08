<?PHP 

session_start();

$con=mysqli_connect("localhost","nathanri_user1","phpuser1","nathanri_benchtime");
	// Check connection
	if (mysqli_connect_errno())
	  	{
	  	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	  	}

$jsonData = file_get_contents("php://input");


$sql= "UPDATE Users SET employeesJson = '$jsonData' WHERE id =1";

	if (!mysqli_query($con,$sql))
	  {
	  die('Error: ' . mysqli_error($con));
	  }

mysqli_close($con);

?>