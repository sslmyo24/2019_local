<?php
	// class loader
	function Loader ($c) {
		require_once $c . ".php";
	}

	spl_autoload_register('Loader');