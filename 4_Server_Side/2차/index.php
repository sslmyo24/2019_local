<?php	
	// session
	session_start();

	// set datetime
	date_default_timezone_set('Asia/Seoul');

	// path
	define("_DIR", __dir__);
	define("_APP", _DIR."/App");
	define("_PUBLIC", _DIR."/Public");

	// url
	define("HOME", str_replace("/index.php", "", $_SERVER['PHP_SELF']));
	define("SRC", HOME."/Public");

	// config
	require_once _APP."/Core/Lib.php";

	App\Core\Controller::run();