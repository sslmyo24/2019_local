<?php
	namespace App\Controller;

	use App\Core\DB;
	use App\Core\Controller;

	class Member extends Controller {
		function action () {
			extract($_POST);

			switch ($action) {
				// login action
				case 'login':
					access(!empty($id) && !empty($pw), "누락된 항목이 있습니다.");

					access($member = DB::fetch("SELECT * FROM member where id = ? and pw = ?", [$id, $pw]), "아이디 또는 비밀번호가 잘못되었습니다.", HOME."/");
					$_SESSION['member'] = $member;

					alert("로그인 되었습니다.");
					move(HOME."/");
					break;
				// join action
				case 'join':
					access(!empty($id) && !empty($pw) && !empty($name) && !empty($nick), "누락된 항목이 있습니다.");

					access(DB::rowCount("SELECT * FROM member where id = ?", [$id]) == 0, "중복된 아이디 입니다.");

					access(filter_var($id, FILTER_VALIDATE_EMAIL), "아이디 형식이 잘못되었습니다.");
					access(!preg_match("/^[a-zA-Z]{5,}$/", $pw) && !preg_match("/^[0-9]{5,}$/", $pw) && preg_match("/^[a-zA-Z0-9]{5,}$/", $pw), "비밀번호 형식이 잘못되었습니다.");
					access(preg_match("/^[가-힣a-zA-Z]+$/", $name), "이름 형식이 잘못되었습니다.");
					access(preg_match("/^[가-힣a-zA-Z0-9]+$/", $name), "닉네임 형식이 잘못되었습니다.");
					access(mb_strlen($nick, 'utf-8') <= 6, "닉네임 형식이 잘못되었습니다.");
					access(!preg_match("/^[0-9]+$/", $nick), "닉네임 형식이 잘못되었습니다.");

					$params = [$id,$pw,$name,$nick];
					DB::query("INSERT INTO member SET id = ?, pw = ?, name = ?, nick = ?", $params);

					alert("회원가입 되었습니다.");
					move(HOME."/");
					break;
			}
		}

		// login page
		function login () {
			access(!$this->param->is_member, "비회원만 접근 가능합니다.", HOME."/");
		}

		// logout
		function logout () {
			session_destroy();
			alert("로그아웃 되었습니다.");
			move(HOME."/");
		}

		// join page
		function join () {
			access(!$this->param->is_member, "비회원만 접근 가능합니다.", HOME."/");
		}
	}
