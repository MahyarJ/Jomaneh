<?php

// require_once('config.php');

$config['dbh'] = 'localhost';
$config['dbu'] = 'root';
$config['dbp'] = '';
$config['dbn'] = 'jomaneh';
$config['auth'] = 0;

$con = mysqli_connect($config['dbh'], $config['dbu'], $config['dbp'], $config['dbn']);

function doquery($sql) {
    $con = &$GLOBALS['con'];
	//echo $sql;
    return mysqli_query($con, $sql);
}

function fetch($result)
{
    return mysqli_fetch_assoc($result);
}

function escape($what)
{
    $con = &$GLOBALS['con'];
    return mysqli_real_escape_string($con, $what);
}

function merror()
{
    $con = &$GLOBALS['con'];
    return mysqli_error($con);
}

function rows($result)
{
    return mysqli_num_rows($result);
}

function get_id_by_name($name, $table)
{
	$query = "SELECT `id` FROM `$table` WHERE (`name`='$name')";
	//echo $query.'<br />';
	$result = doquery($query);
	//var_dump($resultarray);
	$resultarray = fetch($result);
	//echo $resultarray['id'];
	return $resultarray['id'];
}

function convert_mounthname_to_number($mounthname)
{
	switch ($mounthname){
				case 'فروردین':
					return '01';
					break;
				case 'اردیبهشت':
					return '02';
					break;
				case 'خرداد':
					return '03';
					break;
				case 'تیر':
					return '04';
					break;
				case 'مرداد':
					return '05';
					break;
				case 'شهریور':
					return '06';
					break;
				case 'مهر':
					return '07';
					break;
				case 'آبان':
					return '08';
					break;
				case 'آذر':
					return '09';
					break;
				case 'دی':
					return '10';
					break;
				case 'بهمن':
					return '11';
					break;
				case 'اسفند':
					return '12';
					break;
			}
}

function hide_event($event_id)
{
	//$query = "select * from `events`";
	//$res = doquery($query);
	//if($res)
	//{
		doquery("UPDATE `events` SET `show`='0' WHERE `id`=".$event_id);
	//}
}

//------------------------------- User Functions -----------------------------------

function authentication($un,$pass)
{
	$pass = md5($pass);
	$query = "SELCT * FROM `users` WHERE (`username`='$un' AND `password`='$pass')";
	$res=doquery($query);
	if(rows($res) == 1)
	{
		session_start();
		$user = fetch($res);
		$_SESSION['name'] = $user['name'];
	}
}
function user_register($un,$hash)
{
	$q="update `users` set `hash`='$hash'  where (`username`='$un')";
	return doquery($q);
}

function user_checkhash($un,$hash)
{
	$q="select * from `users` where (`username`='$un' and `hash`='$hash')";
	return doquery($q);
}

function user_getinfo($un)
{
	$q="select * from `users` where (`username`='$un')";
	$res=doquery($q);
	return $res;
}

//---------------------------------------------------------------------

function insert_event($title,$date,$text,$type)
{
	$query = "INSERT INTO `events` (`title` , `text` , `date` , `type`) VALUES ('$title','$text','$date','$type')" ;
	return doquery($query);
}

?>