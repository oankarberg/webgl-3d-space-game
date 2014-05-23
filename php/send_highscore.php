<?php

	require('connect.php');

	$name = $_POST['name'];
	$score = $_POST['score'];

	mysql_query("INSERT INTO players (name, date, score)
				 VALUES('$name', CURDATE(), $score)") or die(mysql_error());

	echo "User has been added!";

?>
