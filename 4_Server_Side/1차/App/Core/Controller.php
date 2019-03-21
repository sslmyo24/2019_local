<?php
	namespace App\Core;

	class Controller {
		var $param;

		// get url parameter
		public static function get_param () {
			$get_param = isset($_GET['param']) ? explode("/", $_GET['param']) : null;
			$param['type'] = isset($get_param[0]) && strlen($get_param[0]) ? $get_param[0] : "main";
			$param['action'] = isset($get_param[1]) ? $get_param[1] : null;
			$param['idx'] = isset($get_param[2]) ? $get_param[2] : null;
			$param['include_file'] = isset($param['action']) ? $param['action'] : $param['type'];
			$param['is_member'] = isset($_SESSION['member']);
			$param['member'] = $param['is_member'] ? $_SESSION['member'] : null;
			return (Object)$param;
		}

		// class declaration
		public static function run () {
			$param = self::get_param();
			if (DB::rowCount("SELECT idx FROM member where id = '{$param->type}'") !== 0) {
				$param->userid = $param->type;
				$param->type = 'blog';
				if ($param->include_file == $param->userid) {
					$param->include_file = 'main';
				}
			}
			$ctr_name = "App\\Controller\\".ucfirst($param->type);
			$ctr = new $ctr_name();
			$ctr->param = $param;
			$ctr->index();
		}

		// method execution and set page
		protected function index () {
			if (DB::rowCount("SELECT idx FROM member where level = 'AD'") == 0) {
				$params = ['admin', '1234', '관리자', '관리자', 'AD'];
				DB::query("INSERT INTO member SET id = ?, pw = ?, name = ?, nickname = ?, level = ?", $params);
			}
			if (isset($_POST['action'])) {
				$this->action();
			}
			if (method_exists($this, $this->param->include_file)) {
				$this->{$this->param->include_file}();
			}

			extract((Array)$this);
			require_once _APP."/View/temp/header.php";
			if (isset($this->userid)) {
				require_once _APP."/View/blog/{$this->param->include_file}.php";
			} else {
				require_once _APP."/View/{$this->param->type}/{$this->param->include_file}.php";
			}
		}
	}