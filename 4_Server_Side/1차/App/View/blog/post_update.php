	<h2 class="heading">게시물 수정</h2>
	<form method="post" id="join-form" class="action-form">
		<input type="hidden" name="action" value="post_update">
		<input type="text" class="form-control" placeholder="제목을 입력하세요." name="title" value="<?php echo $data->title ?>" autofocus>
		<textarea class="form-control" placeholder="내용을 입력하세요." name="content" style="height: 100px;"><?php echo $data->content ?></textarea>
		<button type="submit" class="form-btn">수정</button>
	</form>
</body>
</html>