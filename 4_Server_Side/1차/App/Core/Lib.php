<?php
	/**
	 * alert message
	 * @param  [string] $msg [message]
	 */
	function alert ($msg) {
		echo "<script>alert('{$msg}')</script>";
	}

	/**
	 * move page
	 * @param  [string] $url [page url]
	 */
	function move ($url = false) {
		echo "<script>";
		echo $url ? "location.replace('{$url}')" : "history.back();";
		echo "</script>";
		exit;
	}

	/**
	 * access
	 * @param  [boolean] $bol [condition]
	 * @param  [string] $msg [message]
	 * @param  [string] $url [page url]
	 */
	function access ($bol, $msg, $url = false) {
		if (!$bol) {
			alert($msg);
			move($url);
		}
	}

	/**
	 * print pre
	 * @return [type]      [description]
	 */
	function print_pre ($arr) {
		echo "<pre>";
		print_r($arr);
		echo "</pre>";
	}