<?php
	namespace App\Controller;

	use App\Core\Controller;
	use App\Core\DB;

	class Blog extends Controller {

		function action () {
			extract($_POST);

			switch ($action) {
				case 'menu_insert':
					access(!empty($name), "누락된 항목이 있습니다.");

					access(DB::rowCount("SELECT idx FROM menu where midx = ? and name = ?", [$this->param->member->idx, $name]) == 0, "이미 등록된 이름입니다.");

					$params = [$this->param->member->idx, $name];
					DB::query("INSERT INTO menu SET midx = ?, name = ?", $params);
					alert("등록되었습니다.");
					move(HOME."/blog/config");
					break;
				case 'reg_board':
					access(!empty($bidx), "누락된 항목이 있습니다.");

					$params = [$bidx, $midx];
					DB::query("INSERT INTO reg_board SET bidx = ?, midx = ?", $params);
					alert("등록되었습니다.");
					move(HOME."/blog/config");
					break;
				case 'board_insert':
					access(!empty($id), "누락된 항목이 있습니다.");

					access(preg_match("/^[a-zA-Z0-9]+$/", $id), "아이디는 영문과 숫자만 가능합니다.");

					access(DB::rowCount("SELECT idx FROM board where midx = ? and id = ?", [$this->param->member->idx, $id]) == 0, "이미 등록된 아이디입니다.");

					$params = [$this->param->member->idx, $id];
					DB::query("INSERT INTO board SET midx = ?, id = ?", $params);
					alert("등록되었습니다.");
					move(HOME."/blog/config");
					break;
				case 'post_insert':
					access(!empty($title) && !empty($content), "누락된 항목이 있습니다.");

					$params = [$this->param->idx, $title, $content];
					DB::query("INSERT INTO posts SET ridx = ?, title = ?, content = ?, date = now()", $params);
					alert("작성되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
				case 'post_update':
					access(!empty($title) && !empty($content), "누락된 항목이 있습니다.");

					$params = [$title, $content, $this->param->idx];
					DB::query("UPDATE posts SET title = ?, content = ? where idx = ?", $params);
					alert("수정되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
				case 'comment_insert':
					access(!empty($content), "누락된 항목이 있습니다.");

					$params = [$this->param->idx, $this->param->member->idx, $content];
					DB::query("INSERT INTO comment SET pidx = ?, midx = ?, content = ?", $params);
					alert("작성되었습니다.");
					move(HOME."/".$this->param->userid."/view/".$this->param->idx);
					break;
				case 'comment_update':
					access(!empty($content), "누락된 항목이 있습니다.");

					$params = [$this->param->idx, $content, $this->param->idx];
					DB::query("UPDATE comment SET content = ? where idx = ?", $params);
					alert("수정되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
				case 'reply_insert':
					access(!empty($content), "누락된 항목이 있습니다.");

					$params = [$this->param->idx, $this->param->member->idx, $content];
					DB::query("INSERT INTO reply SET parent = ?, midx = ?, content = ?, type = 'comment'", $params);
					alert("작성되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
				case 'reply_update':
					access(!empty($content), "누락된 항목이 있습니다.");

					$params = [$content, $this->param->idx];
					DB::query("UPDATE reply SET content = ? where idx = ?", $params);
					alert("수정되었습니다.");
					move(HOME."/".$this->param->userid);
					break;
			}
		}

		// blog main page
		function main () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
			$this->menu_list = DB::fetchAll("SELECT menu.name, menu.idx FROM menu JOIN member ON member.idx = menu.midx where member.id = ?", [$this->param->userid]);
			$i = 1;
			foreach ($this->menu_list as $data) {
				$sum = "sum".$i;
				$this->$sum = DB::rowCount("SELECT p.idx FROM reg_board r JOIN posts p ON r.idx = p.ridx where r.midx = ? ", [$data->idx]);
				$i++;
			}
		}

		// blog management
		function config () {
			access($this->param->is_member, "로그인 후 사용가능 합니다.", HOME."/member/login");
			if ($this->param->member->level == 'MP') {
	 			$this->menu_list = DB::fetchAll("SELECT * FROM menu where midx = ?", [$this->param->member->idx]);
				$this->board_list = DB::fetchAll("SELECT * FROM board where midx = ?", [$this->param->member->idx]);
			} else if ($this->param->member->level == 'AD') {
				$this->member_list = DB::fetchAll("SELECT * FROM member where level = 'MP'");
			}
		}

		// post list
		function menu () {
			$this->menu = DB::fetch("SELECT name FROM menu where idx = ?", [$this->param->idx]);
			$this->board_list = DB::fetchAll("SELECT b.id, r.idx FROM board b JOIN reg_board r ON r.bidx = b.idx where r.midx = ?", [$this->param->idx]);
			if ($this->board_list != null) {
				$i = 1;
				foreach ($this->board_list as $data) {
					$list_name = "post_list".$i;
					$this->$list_name = DB::fetchAll("SELECT * FROM posts where ridx = ?", [$data->idx]);
					$i++;
				}
			}
		}

		// view post
		function view () {
			$this->data = DB::fetch("SELECT * FROM posts where idx = ?", [$this->param->idx]);
			$this->comment_list = DB::fetchAll("SELECT c.content, c.idx, m.nickname FROM comment c JOIN member m ON m.idx = c.midx where c.pidx = ?", [$this->param->idx]);
			$i = 1;
			foreach ($this->comment_list as $data) {
				$list = "reply".$i;
				$this->$list = DB::fetchAll("SELECT r.*, m.nickname FROM reply r JOIN member m ON m.idx = r.midx where r.type = 'comment' and r.parent = ?", [$data->idx]);
				$i++;
			}
		}

		// post insert
		function post_insert () {
			$owner = DB::fetch("SELECT m.idx FROM member m JOIN board b ON b.midx = m.idx where b.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "자신의 블로그만 게시물 작성, 수정, 삭제 할 수 있습니다.", HOME."/".$this->param->userid);
		}

		// post update
		function post_update () {
			$owner = DB::fetch("SELECT m.idx FROM member m JOIN board b ON b.midx = m.idx where b.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "자신의 블로그만 게시물 작성, 수정, 삭제 할 수 있습니다.", HOME."/".$this->param->userid);
			$this->data = DB::fetch("SELECT * FROM posts where idx = ?", [$this->param->idx]);
		}

		// post update
		function post_delete () {
			$owner = DB::fetch("SELECT m.idx FROM member m JOIN board b ON b.midx = m.idx where b.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "자신의 블로그만 게시물 작성, 수정, 삭제 할 수 있습니다.", HOME."/".$this->param->userid);
			DB::query("DELETE FROM comment where pidx = ?", [$this->param->idx]);
			DB::query("DELETE FROM posts where idx = ?", [$this->param->idx]);
			alert("삭제되었습니다.");
			move(HOME."/".$this->param->userid);
		}

		// post update
		function comment_update () {
			$owner = DB::fetch("SELECT m.idx FROM member m JOIN comment c ON c.midx = m.idx where c.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "자신의 댓글만 수정, 삭제 할 수 있습니다.", HOME."/".$this->param->userid);
			$this->data = DB::fetch("SELECT * FROM comment where idx = ?", [$this->param->idx]);
		}

		// comment update
		function comment_delete () {
			$owner = DB::fetch("SELECT m.idx FROM member m JOIN comment c ON c.midx = m.idx where c.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "자신의 댓글만 수정, 삭제 할 수 있습니다.", HOME."/".$this->param->userid);
			DB::query("DELETE FROM reply where type = 'comment' parent = ?", [$this->param->idx]);
			DB::query("DELETE FROM comment where idx = ?", [$this->param->idx]);
			alert("삭제되었습니다.");
			move(HOME."/".$this->param->userid);
		}

		// reply insert
		function reply_insert () {
			access($this->param->is_member, "로그인 후 가능합니다.", HOME."/member/login");
		}

		// reply update
		function reply_update () {
			$owner = DB::fetch("SELECT m.idx FROM member m JOIN reply r ON r.midx = m.idx where r.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "자신의 답글만 수정, 삭제 할 수 있습니다.", HOME."/".$this->param->userid);
			$this->data = DB::fetch("SELECT * FROM reply where idx = ?", [$this->param->idx]);
		}

		// reply delete
		function reply_delete () {
			$owner = DB::fetch("SELECT m.idx FROM member m JOIN reply r ON r.midx = m.idx where r.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "자신의 답글만 수정, 삭제 할 수 있습니다.", HOME."/".$this->param->userid);
			DB::query("DELETE FROM reply where idx = ?", [$this->param->idx]);
			alert("삭제되었습니다.");
			move(HOME."/".$this->param->userid);
		}

		// menu delete
		function menu_delete () {
			$owner = DB::fetch("SELECT member.idx FROM member JOIN menu ON menu.midx = member.idx where menu.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "본인만 삭제 가능합니다.");
			$reg_list = DB::fetchAll("SELECT idx FROM reg_board where midx = ?", [$this->param->idx]);
			foreach ($reg_list as $reg_data) {
				$posts = DB::fetchAll("SELECT idx FROM posts where ridx = ?", [$data->idx]);
				foreach ($posts as $post_data) {
					DB::query("DELETE FROM comment where pidx = ?", [$post_data->idx]);
					DB::query("DELETE FROM reply where pidx = ?", [$post_data->idx]);
				}
				DB::query("DELETE FROM posts where ridx = ?", [$data->idx]);
			}
			DB::query("DELETE FROM reg_board where midx = ?", [$this->param->idx]);
			DB::query("DELETE FROM menu where idx = ?", [$this->param->idx]);
			alert('삭제 되었습니다.');
			move(HOME."/blog/config");
		}

		// board delete
		function board_delete () {
			$owner = DB::fetch("SELECT member.idx FROM member JOIN menu ON menu.midx = member.idx where menu.idx = ?", [$this->param->idx]);
			access($this->param->is_member && $this->param->member->idx == $owner->idx, "본인만 삭제 가능합니다.");
			$reg_list = DB::fetchAll("SELECT idx FROM reg_board where bidx = ?", [$this->param->idx]);
			foreach ($reg_list as $reg_data) {
				$posts = DB::fetchAll("SELECT idx FROM posts where ridx = ?", [$data->idx]);
				foreach ($posts as $post_data) {
					DB::query("DELETE FROM comment where pidx = ?", [$post_data->idx]);
					DB::query("DELETE FROM reply where pidx = ?", [$post_data->idx]);
				}
				DB::query("DELETE FROM posts where ridx = ?", [$data->idx]);
			}
			DB::query("DELETE FROM reg_board where bidx = ?", [$this->param->idx]);
			DB::query("DELETE FROM board where idx = ?", [$this->param->idx]);
			alert('삭제 되었습니다.');
			move(HOME."/blog/config");
		}

		// member delete
		function member_delete () {
			access($this->param->is_member && $this->param->member->level == 'AD', "관리자만 삭제 가능합니다.");
			$menu_data = DB::fetch("SELECT idx FROM menu where midx = ?", [$this->param->idx]);
			$reg_list = DB::fetchAll("SELECT idx FROM reg_board where midx = ?", [$menu_data->idx]);
			foreach ($reg_list as $reg_data) {
				$posts = DB::fetchAll("SELECT idx FROM posts where ridx = ?", [$reg_data->idx]);
				foreach ($posts as $post_data) {
					DB::query("DELETE FROM comment where pidx = ?", [$post_data->idx]);
					DB::query("DELETE FROM reply where pidx = ?", [$post_data->idx]);
				}
				DB::query("DELETE FROM posts where ridx = ?", [$reg_data->idx]);
			}
			DB::query("DELETE FROM board where midx = ?", [$menu_data->idx]);
			DB::query("DELETE FROM reg_board where midx = ?", [$menu_data->idx]);
			DB::query("DELETE FROM menu where midx = ?", [$this->param->idx]);
			DB::query("DELETE FROM member where idx = ?", [$this->param->idx]);
			alert("삭제 되었습니다.");
			move(HOME."/blog/config");
		}
	}