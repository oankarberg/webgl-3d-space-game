<?php
	
	require('connect.php');
	header('content-type: application/json;');

/*
	mysql_query("INSERT INTO players (pid, name, date, score)
				 VALUES(NULL, 'hej', CURDATE(), '24')") or die(mysql_error());
	echo "User has been added!";*/

	$query = "SELECT * FROM players";
	$result = mysql_query($query);

	$rows = array();

	while($r = mysql_fetch_assoc($result)) {
	 	 $rows[] = $r;
	}

	echo json_encode($rows);
	/*
	while($row = mysql_fetch_array($result))
		echo json_encode($row);
*/
/*
	while($players = mysql_fetch_array($result)){

		echo "<h3>" . $players['pid'] . "</h3>";
		echo "<h3>" . $players['name'] . "</h3>";

	}*/

?>
