<?php
	namespace App\Controller;

	use App\Core\DB;
	use App\Core\Controller;

	class Admin extends Controller {
		function action () {
			extract($_POST);

			switch ($action) {
				// 메뉴 등록
				case 'menu_write':
					access(!empty($name), "누락된 항목이 있습니다.");

					access(DB::rowCount("SELECT idx FROM menu where midx = ? and name = ?", [$this->param->member->idx, $name]) == 0, "이미 등록된 메뉴 입니다.");

					$params = [$this->param->member->idx, $name];
					DB::query("INSERT INTO menu SET midx = ?, name = ?", $params);

					alert("등록되었습니다.");
					move(HOME."/admin/menu");
					break;
				// 게시판 등록
				case 'board_write':
					access(!empty($id), "누락된 항목이 있습니다.");

					access(preg_match("/^[a-zA-Z0-9]+$/", $id), "아이디는 영문과 숫자만 가능합니다.");

					access(DB::rowCount("SELECT idx FROM board where midx = ? and id = ?", [$this->param->member->idx, $id]) == 0, "이미 등록된 게시판 입니다.");

					$params = [$this->param->member->idx, $id];
					DB::query("INSERT INTO board SET midx = ?, id = ?", $params);

					alert("등록되었습니다.");
					move(HOME."/admin/board");
					break;
				// 게시판 메뉴에 등록
				case 'reg_board':
					access(!empty($bidx), "누락된 항목이 있습니다.");

					$params = [$bidx, $midx];
					DB::query("UPDATE menu SET reg_board = ? where idx = ?", $params);

					alert("등록되었습니다.");
					move(HOME."/admin/menu");
					break;
			}
		}

		// 메뉴 관리
		function menu () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
			$this->menu_list = DB::fetchAll("SELECT * FROM menu where midx = ?", [$this->param->member->idx]);
			$this->board_list = DB::fetchAll("SELECT * FROM board where midx = ?", [$this->param->member->idx]);
		}

		// 메뉴 등록
		function menu_write () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
		}

		// 메뉴 삭제
		function menu_delete () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
			DB::query("DELETE FROM p using post p JOIN menu m ON m.reg_board = p.bidx where m.idx = ?", [$this->param->idx]);
			DB::query("DELETE FROM menu where idx = ?", [$this->param->idx]);
			alert("삭제 되었습니다.");
			move(HOME."/admin/menu");
		}

		// 게시판 관리
		function board () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
			$this->board_list = DB::fetchAll("SELECT * FROM board where midx = ?", [$this->param->member->idx]);
		}

		// 게시판 등록
		function board_write () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
		}

		// 게시판 삭제
		function board_delete () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
			DB::query("UPDATE menu SET reg_board = null where reg_board = ?", [$this->param->idx]);
			DB::query("DELETE FROM post where bidx = ?", [$this->param->idx]);
			DB::query("DELETE FROM board where idx = ?", [$this->param->idx]);
			alert("삭제 되었습니다.");
			move(HOME."/admin/board");
		}

		// 회원 관리
		function member () {
			access($this->param->is_member && $this->param->member->id == 'admin', "관리자만 접근가능 합니다.");
			$this->member_list = DB::fetchAll("SELECT * FROM member");
		}

		// 회원 삭제
		function member_delete () {
			access($this->param->is_member && $this->param->member->id == 'admin', "관리자만 접근가능 합니다.");
			$menu_list = DB::fetchAll("SELECT * FROM menu where midx = ?", [$this->param->idx]);
			foreach ($menu_list as $menu) {
				$post_list = DB::fetchAll("SELECT * FROM post where bidx = ?", [$menu->reg_board]);
				foreach ($post_list as $post) {
					DB::query("DELETE FROM comment where pidx = ?", [$post->idx]);
				}
				DB::query("DELETE FROM post where bidx = ?", [$menu->reg_board]);
			}
			DB::query("DELETE FROM board where midx = ?", [$menu->idx]);
			DB::query("DELETE FROM menu where midx = ?", [$menu->idx]);
			DB::query("DELETE FROM member where idx = ?", [$menu->idx]);
			alert("삭제되었습니다.");
			move(HOME."/admin/member");
		}
	}
