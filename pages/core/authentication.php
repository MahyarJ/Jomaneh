<?php
	//require_once('config.php');
	session_start();
		if (!isset($_SESSION['name']))
		{			
			header("Location: ./login.php");
			//echo 'non-authenticated';
			//header("Location: ./login.php");
			//return true;
		}
?>