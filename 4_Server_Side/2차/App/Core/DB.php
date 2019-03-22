<?php
	namespace App\Core;

	class DB {
		/*Data base*/
		private static $db;

		/**
		 * Database connect and get Database
		 * @return [object] [database]
		 */
		public static function init () {
			if (is_null(self::$db)) {
				$option = array(\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ);
				self::$db = new \PDO("mysql:host=127.0.0.1;charset=utf8;dbname=blog","root","",$option);
			}

			return self::$db;
		}

		/**
		 * [database query action]
		 * @param  [string]  $sql    [mysql query code]
		 * @param  [array] $params [values]
		 * @return [array]          [query result]
		 */
		public static function query ($sql, $params = []) {
			$res = self::init()->prepare($sql);
			if (!$res->execute($params)) {
				echo $sql;
				print_pre($params);
				print_pre(self::init()->errorInfo());
				exit;
			}

			return $res;
		}

		/**
		 * [get data]
		 * @param  [string]  $sql    [mysql query code]
		 * @param  [array] $params [values]
		 * @return [object]          [data]
		 */
		public static function fetch ($sql, $params = []) {
			return self::query($sql, $params)->fetch();
		}

		/**
		 * [get data list]
		 * @param  [string]  $sql    [mysql query code]
		 * @param  [array] $params [values]
		 * @return [array]          [data list]
		 */
		public static function fetchAll ($sql, $params = []) {
			return self::query($sql, $params)->fetchAll();
		}

		/**
		 * [get the number of data]
		 * @param  [string]  $sql    [mysql query code]
		 * @param  [array] $params [values]
		 * @return [number]          [the number of data]
		 */
		public static function rowCount ($sql, $params = []) {
			return self::query($sql, $params)->rowCount();
		}

	}