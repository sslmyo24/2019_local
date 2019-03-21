	<h2 class="heading">댓글 수정</h2>
	<form method="post" id="comment-form" class="action-form">
		<input type="hidden" name="action" value="comment_update">
		<input type="text" class="form-control" placeholder="내용을 입력하세요." name="content" value="<?php echo $data->content ?>" autofocus>
		<button type="submit" class="form-btn">수정</button>
	</form>
</body>
</html>