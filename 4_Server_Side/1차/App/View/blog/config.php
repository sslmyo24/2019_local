<?php if ($this->param->is_member): ?>
	<?php if ($this->param->member->level == 'MP'): ?>
	<!-- 회원 -->
	<h2 class="heading">메뉴 등록</h2>
	<form method="post" class="action-form">
		<input type="hidden" name="action" value="menu_insert">
		<input type="text" class="form-control" placeholder="이름" name="name">
		<button type="submit" class="form-btn">등록</button>
	</form>

	<h2 class="heading">메뉴리스트</h2>
	<table class="list" border="1" cellspacing="0">
		<tbody>
			<?php foreach ($menu_list as $data): ?>
			<tr>
				<td><?php echo $data->name ?></td>
				<td><a href="<?php echo HOME ?>/blog/menu_delete/<?php echo $data->idx ?>">삭제</a></td>
				<td>
					<form method="post">
						<input type="hidden" name="action" value="reg_board">
						<input type="hidden" name="midx" value="<?php echo $data->idx ?>">
						<select name="bidx">
							<?php foreach ($board_list as $data): ?>
							<option value="<?php echo $data->idx ?>"><?php echo $data->id ?></option>
							<?php endforeach; ?>
						</select>
						<button type="submit">등록</button>
					</form>
				</td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>

	<h2 class="heading">게시판 등록</h2>
	<form method="post" class="action-form">
		<input type="hidden" name="action" value="board_insert">
		<input type="text" class="form-control" placeholder="아이디" name="id">
		<button type="submit" class="form-btn">등록</button>
	</form>

	<h2 class="heading">게시판 리스트</h2>
	<table class="list" border="1" cellspacing="0">
		<tbody>
			<?php foreach ($board_list as $data): ?>
			<tr>
				<td><?php echo $data->id ?></td>
				<td><a href="<?php echo HOME ?>/blog/board_delete/<?php echo $data->idx ?>">삭제</a></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>


	<?php elseif ($this->param->member->level == 'AD'): ?>
	<!-- 관리자 -->
	<h2 class="heading">회원 리스트</h2>
	<table class="list" border="1" cellspacing="0">
		<thead>
			<tr>
				<th>아이디</th>
				<th>이름</th>
				<th>닉네임</th>
				<th>블로그URL</th>
				<th>기능</th>
			</tr>
		</thead>
		<tbody>
			<?php foreach ($member_list as $data): ?>
			<tr>
				<td><?php echo $data->id ?></td>
				<td><?php echo $data->name ?></td>
				<td><?php echo $data->nickname ?></td>
				<td>
					<?php
						echo $_SERVER['REQUEST_SCHEME']."://";
						echo $_SERVER['HTTP_HOST'];
						echo "/".$data->id;
					?>
				</td>
				<td><a onclick="if (!confirm('정말삭제 하시겠습니까?')) return false;" href="<?php echo HOME ?>/blog/member_delete/<?php echo $data->idx ?>">삭제</a></td>
			</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
	
	<?php endif; ?>
<?php endif; ?>

</body>
</html>
