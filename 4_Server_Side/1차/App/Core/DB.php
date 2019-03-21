<?php
	namespace App\Core;

	class DB {
		private static $db; // database

		/**
		 * database connect and return database
		 * @return [object] [database]
		 */
		public static function init () {
			if (is_null(self::$db)) {
				$option = array(\PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_OBJ);
				self::$db = new \PDO("mysql:host=127.0.0.1;charset=utf8;dbname=Blog","root","",$option);
			}

			return self::$db;
		}

		/**
		 * query action
		 * @param  [string] $sql    [query code]
		 * @param  [array] $params [params]
		 * @return [array]         [query result]
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
		 * get data
		 * @param  [string] $sql    [query code]
		 * @param  [array] $params [params]
		 * @return [object]         [data]
		 */
		public static function fetch ($sql, $params = []) {
			return self::query($sql, $params)->fetch();
		}

		/**
		 * get data list
		 * @param  [string] $sql    [query code]
		 * @param  [array] $params [params]
		 * @return [array]         [data list]
		 */
		public static function fetchAll ($sql, $params = []) {
			return self::query($sql, $params)->fetchAll();
		}

		/**
		 * get the number of data
		 * @param  [string] $sql    [query code]
		 * @param  [array] $params [params]
		 * @return [number]         [the number of data]
		 */
		public static function rowCount ($sql, $params = []) {
			return self::query($sql, $params)->rowCount();
		}

	}