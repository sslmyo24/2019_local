<?php
	namespace App\Controller;

	use App\Core\DB;
	use App\Core\Controller;

	class Blog extends Controller {
		function action () {
			extract($_POST);

			switch ($action) {
				case 'post_write':
					access(!empty($title) && !empty($content), "누락된 항목이 있습니다.");

					$params = [$this->param->idx, $this->param->member->idx, $title, $content];
					DB::query("INSERT INTO post SET bidx = ?, writer = ?, title = ?, content = ?, parent = 0, date = now()", $params);

					alert("작성되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
				case 'post_update':
					access(!empty($title) && !empty($content), "누락된 항목이 있습니다.");

					$params = [$title, $content, $this->param->idx];
					DB::query("UPDATE post SET title = ?, content = ? where idx = ?", $params);

					alert("수정되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
				case 'reply_write':
					access(!empty($title) && !empty($content), "누락된 항목이 있습니다.");

					$data = DB::fetch("SELECT * FROM post where idx = ?", [$this->param->idx]);
					$params = [$data->bidx, $this->param->member->idx, $title, $content, $this->param->idx];
					DB::query("INSERT INTO post SET bidx = ?, writer = ?, title = ?, content = ?, parent = ?, date = now()", $params);

					alert("작성되었습니다.");
					move(HOME."/".$this->param->userid."/view/".$this->param->idx);
					break;
				case 'comment_write':
					access(!empty($content), "누락된 항목이 있습니다.");

					$params = [$this->param->member->idx, $content, $this->param->idx];
					DB::query("INSERT INTO comment SET midx = ?, content = ?, pidx = ?, date = now()", $params);

					alert("작성되었습니다.");
					move(HOME."/".$this->param->userid."/view/".$this->param->idx);
					break;
				case 'comment_update':
					access(!empty($content), "누락된 항목이 있습니다.");

					$params = [$content, $this->param->idx];
					DB::query("UPDATE comment SET content = ? where idx = ?", $params);

					alert("수정되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
			}
		}

		// nav set
		function setNav () {
			$this->menu_list = DB::fetchAll("SELECT m1.* FROM menu m1 JOIN member m2 ON m1.midx = m2.idx where m2.id = ? ", [$this->param->userid]);
			foreach ($this->menu_list as $data) {
				$cnt = "post_cnt".$data->name;
				$this->$cnt = DB::rowCount("SELECT idx FROM post where bidx = ? and parent = 0", [$data->reg_board]);
			}
		}

		// blog main
		function main () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
			// access($this->param->member->id !== 'admin', '회원만 접근 가능합니다.', HOME."/");
			$this->setNav();
			if ($this->menu_list) {
				if ($this->param->idx === null) {
					$this->param->idx = $this->menu_list[0]->idx;
				}
				$this->select_menu = DB::fetch("SELECT * FROM menu where idx = ?", [$this->param->idx]);
				if ($this->select_menu->reg_board) {
					$this->post_list = DB::fetchAll("SELECT p.*, m2.name as writer FROM post p JOIN menu m1 ON m1.reg_board = p.bidx JOIN member m2 ON m1.midx = m2.idx where p.parent = 0 and m1.idx = ?", [$this->param->idx]);
					foreach ($this->post_list as $key => $post_data) {
						$reply = "reply".$key;
						$this->$reply = DB::fetchAll("SELECT p.*, m.name FROM post p JOIN member m ON m.idx = p.writer where p.parent = ?", [$post_data->idx]);
					}
				}
			}
		}

		// post write
		function post_write () {
			access($this->param->is_member, "로그인 후 사용가능합니다.", HOME."/member/login");
			access($this->param->userid == $this->param->member->id, "자신의 블로그만 게시물을 작성, 수정, 삭제 할 수 있습니다.");
			$this->setNav();
		}

		// post update
		function post_update () {
			access($this->param->is_member, "로그인 후 사용가능합니다.", HOME."/member/login");
			$data = DB::fetch("SELECT writer FROM post where idx = ?", [$this->param->idx]);
			access($this->param->member->id == 'admin' || ($this->param->userid == $this->param->member->id && $this->param->member->idx == $data->writer) || $this->param->member->idx == $data->writer, "자신의 게시물만 작성, 수정, 삭제 할 수 있습니다.");
			$this->setNav();
			$this->post_data = DB::fetch("SELECT * FROM post where idx = ?", [$this->param->idx]);
		}

		// post view
		function view () {
			access($this->param->is_member, "로그인 후 사용가능합니다.", HOME."/member/login");
			$this->setNav();
			$this->post_data = DB::fetch("SELECT * FROM post where idx = ?", [$this->param->idx]);
			$this->comment_list = DB::fetchAll("SELECT c.*, m.nick FROM comment c JOIN member m ON m.idx = c.midx where c.pidx = ?", [$this->param->idx]);
		}

		// post delete
		function post_delete () {
			access($this->param->is_member, "로그인 후 사용가능합니다.", HOME."/member/login");
			$data = DB::fetch("SELECT writer FROM post where idx = ?", [$this->param->idx]);
			access(($this->param->userid == $this->param->member->id && $this->param->member->idx == $data->writer) || $this->param->member->id == 'admin' || $this->param->member->idx == $data->writer, "자신의 블로그만 게시물을 작성, 수정, 삭제 할 수 있습니다.");
			DB::query("DELETE FROM comment where pidx = ?", [$this->param->idx]);
			DB::query("DELETE FROM post where parent = ?", [$this->param->idx]);
			DB::query("DELETE FROM post where idx = ?", [$this->param->idx]);
			alert("삭제 되었습니다.");
			move(HOME."/".$this->param->userid);
		}

		// reply write
		function reply_write () {
			access($this->param->is_member, "로그인 후 사용가능합니다.", HOME."/member/login");
			$this->setNav();
		}

		// comment update
		function comment_update () {
			access($this->param->is_member, "로그인 후 사용가능합니다.", HOME."/member/login");
			$data = DB::fetch("SELECT midx FROM comment where idx = ?", [$this->param->idx]);
			access($this->param->member->idx == $data->midx || $this->param->member->id == 'admin', "자신의 댓글만 수정 할 수 있습니다.");
			$this->setNav();
			$this->comment_data = DB::fetch("SELECT * FROM comment where idx = ?", [$this->param->idx]);
		}

		// comment delete
		function comment_delete () {
			access($this->param->is_member, "로그인 후 사용가능합니다.", HOME."/member/login");
			$data = DB::fetch("SELECT midx FROM comment where idx = ?", [$this->param->idx]);
			access($this->param->member->idx == $data->midx || $this->param->member->id == 'admin', "자신의 댓글만 삭제 할 수 있습니다.");
			DB::query("DELETE FROM comment where idx = ?", [$this->param->idx]);
			alert("삭제 되었습니다.");
			move(HOME."/".$this->param->userid);
		}
	}

