<?php

	// require_once 'date/jdf.php';

	require_once 'core/database.php';

	session_set_cookie_params(0, '/', '.ngb.local');

	session_start();


	if (isset($_POST['un']))
	{

		$query = "SELECT * FROM `users` WHERE `username`='" . $_POST['username'] . "' AND `password`='" . md5($_POST['password']) . "'";

		$result = doquery($query);

		if (rows($result) == 1)
		{

			$user = fetch($result);

			$name = $user['name'];

			$_SESSION['username'] = $_POST['un'];

			$_SESSION['name'] = $name;

			// header("Location: ./manage.php");

		}

	}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>

	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

	<title>جمانه - ورود</title>

	<link rel="stylesheet" type="text/css" href="../styles/css/main.css">

<!--
	<script src="../scripts/require.js"></script>

	<script>
		require.config({

			baseUrl: '../scripts/js/lib'

		});

		require(['../scripts/js/pages/demo.js']);
	</script>

 -->
</head>
<body>

	<div class="sky">

		<div class="clouds">

			<div class="cloud-back"></div>

			<div class="cloud"></div>

		</div>

		<form class="login-box" method="post" action="">

			<input type="text" placeholder="نام کاربری">

			<input type="password" placeholder="رمز عبور">

			<input type="submit" class="btn" value="ورود">

		</form>

	</div>

	<script src="../scripts/vendor/jquery-1.9.1.min.js"></script>

	<script src="../scripts/js/lib/login.js"></script>

</body>

</html>