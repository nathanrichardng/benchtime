<?PHP 

session_start();

$con=mysqli_connect("localhost","nathanri_user1","phpuser1","nathanri_benchtime");
	// Check connection
	if (mysqli_connect_errno())
	  	{
	  	echo "Failed to connect to MySQL: " . mysqli_connect_error();
	  	}

$result= mysqli_query($con, "SELECT benchesJson from Users WHERE id =1");

while($row = mysqli_fetch_array($result)) {
	echo $row['benchesJson'];
}

mysqli_close($con);

?>