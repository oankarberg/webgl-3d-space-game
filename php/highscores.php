<?php
	
	$db_host = "localhost";
	$db_user = "root";
	$db_pass = "";
	$db = "highscores";

	$conn = mysql_connect($db_host, $db_user, $dbpass);
	mysql_select_db($db);

/*
	mysql_query("INSERT INTO players (pid, name, date, score)
				 VALUES(NULL, 'hej', CURDATE(), '24')") or die(mysql_error());
	echo "User has been added!";*/

	$query = "SELECT * FROM players";
	$result = mysql_query($query);
	$array = mysql_fetch_row($result);

	echo json_encode($array);

/*
	while($players = mysql_fetch_array($result)){

		echo "<h3>" . $players['pid'] . "</h3>";
		echo "<h3>" . $players['name'] . "</h3>";

	}*/


?>
