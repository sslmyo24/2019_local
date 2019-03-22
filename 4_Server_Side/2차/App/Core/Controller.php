<?php
	namespace App\Core;

	class Controller {
		var $param;

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

		public static function run () {
			$param = self::get_param();
			if ($param->type !== 'admin' && DB::rowCount("SELECT idx FROM member where id = ?", [$param->type]) !== 0) {
				$param->userid = $param->type;
				$param->type = 'blog';
				if (!isset($param->action)) $param->include_file = 'main';
			}
			$ctr = "App\\Controller\\".ucfirst($param->type);
			$ctr = new $ctr();
			$ctr->param = $param;
			$ctr->index();
		}

		protected function index () {
			if (DB::rowCount("SELECT idx FROM member where id = 'admin'") == 0) {
				$params = ['admin', '1234', '관리자', '관리자'];
				DB::query("INSERT INTO member SET id = ?, pw = ?, name = ?, nick = ?", $params);
			}

			if (isset($_POST['action'])) {
				$this->action();
			}
			if (method_exists($this, $this->param->include_file)) {
				$this->{$this->param->include_file}();
			}

			extract((Array)$this);
			require_once _APP."/View/temp/header.php";
			if ($this->param->type == 'admin') require_once _APP."/View/admin/nav.php";
			require_once _APP."/View/{$this->param->type}/{$this->param->include_file}.php";
			require_once _APP."/View/temp/footer.php";
		}
	}