<?php

	require('connect.php');

	$name = $_POST['name'];
	$score = $_POST['score'];

	echo $name;
	echo $score;

	mysql_query("INSERT INTO highscores (pid, name, date, score)
				 VALUES(NULL, '$name', CURDATE(), $score)") or die(mysql_error());

	echo "User has been added!";


?>
