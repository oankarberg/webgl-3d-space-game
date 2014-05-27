<?php
	
	require('connect.php');
	header('content-type: application/json;');

	$query = "SELECT * FROM players ORDER BY score DESC";
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
