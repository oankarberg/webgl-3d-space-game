<?php

	// ska fungera och vara uppe.. kör annars via localhost

	$db_host = "mysql10.000webhost.com";
	$db_user = "a7287502_space";
	$db_pass = "hejlol123";
	$db = "a7287502_space";

	$conn = mysql_connect($db_host, $db_user, $db_pass);
	mysql_select_db($db);

/*
	$mysql_host = "localhost";
	$mysql_database = "a7287502_space";
	$mysql_user = "root";
	$mysql_password = "";
*/

?>