<?php
	namespace App\Controller;

	use App\Core\Controller;
	use App\Core\DB;

	class Member extends Controller {
		function action () {
			extract($_POST);

			switch ($action) {
				case 'login':
					access(!empty($id) && !empty($pw), "누락된 항목이 있습니다.");

					access($member = DB::fetch("SELECT * FROM member where id = ? and pw = ?", [$id, $pw]), "아이디 또는 비밀번호가 잘못 되었습니다.", HOME."/main");
					$_SESSION['member'] = $member;

					alert("로그인 되었습니다.");
					move(HOME."/main");
					break;
				case 'join':
					access(!empty($id) && !empty($pw) && !empty($name) && !empty($nickname), "누락된 항목이 있습니다.");

					access(preg_match("/^[a-zA-Z0-9]+@[a-z]+\.[a-z]+\.?[a-z]*$/", $id), "아이디 형식이 잘못되었습니다.");
					access(preg_match("/^[a-zA-Z0-9]{5,}$/", $pw) && preg_match("/[a-zA-Z]+/", $pw) && preg_match("/[0-9]+/", $pw), "비밀번호 형식이 잘못되었습니다.");
					access(preg_match("/^([가-힣]|[a-zA-Z])+$/", $name), "이름 형식이 잘못되었습니다.");
					access((preg_match("/^([가-힣]|[0-9]){3,18}$/", $nickname) || preg_match("/^([a-zA-Z]|[0-9]){1,6}$/", $nickname)) && !preg_match("/^[0-9]+$/", $nickname), "닉네임 형식이 잘못되었습니다.");

					access(DB::rowCount("SELECT idx FROM member where id = ?", [$id]) == 0, "중복된 아이디 입니다.");

					$params = [$id, $pw, $name, $nickname, 'MP'];
					DB::fetch("INSERT INTO member SET id = ?, pw = ?, name = ?, nickname = ?, level = ?", $params);

					alert("회원가입 되었습니다.");
					move(HOME."/main");
					break;
			}
		}

		// login page
		function login () {
			access(!$this->param->is_member, "비회원만 접근 가능합니다.", HOME."/main");
		}

		// logout
		function logout () {
			session_destroy();
			alert("로그아웃 되었습니다.");
			move(HOME."/main");
		}

		// join page
		function join () {
			access(!$this->param->is_member, "비회원만 접근 가능합니다.", HOME."/main");
		}
	}