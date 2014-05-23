<?php

	//för localhost.. 

	$db_host = "localhost";
	$db_user = "root";
	$db_pass = "";
	$db = "highscores";

	$conn = mysql_connect($db_host, $db_user, $db_pass);
	mysql_select_db($db);

/*
	$mysql_host = "localhost";
	$mysql_database = "a7287502_space";
	$mysql_user = "root";
	$mysql_password = "";
*/

?>