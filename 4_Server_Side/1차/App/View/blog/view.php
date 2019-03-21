	<div class="list" style="width: 400px;">
		<div><span>제목 : </span><?php echo $data->title ?></div>
		<div><span>내용 : </span><?php echo $data->content ?></div>
	</div>
	<h5 class="heading">댓글 작성</h5>
	<form method="post" style="width: 300px; margin:0 auto;">
		<input type="hidden" name="action" value="comment_insert">
		<textarea type="text" class="form-control" name="content"></textarea>
		<button type="submit" class="form-btn">작성</button>
	</form>
	<h4 class="heading">댓글</h4>
	<ul class="list" style="width: 1000px; display: flex;justify-content: flex-start;flex-wrap: wrap;">
		<?php $i = 1; ?>
		<?php foreach ($comment_list as $data): ?>
			<?php $list = "reply".$i; ?>
			<li>
				<td><span>작성자 : </span><?php echo $data->nickname ?></td>
				<td><span>내용 : </span><?php echo $data->content ?></td>
				<td>
					<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/reply_insert/<?php echo $data->idx ?>">답글 작성</a>
					<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/comment_update/<?php echo $data->idx ?>">수정</a>
					<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/comment_delete/<?php echo $data->idx ?>">삭제</a>
				</td>
			</li>
			<div style="width:100%;height:10px;"></div>
			<?php foreach ($$list as $reply): ?>
			<li>
				<td>ㄴ</td>
				<td><span>작성자 : </span><?php echo $reply->nickname ?></td>
				<td><span>내용 : </span><?php echo $reply->content ?></td>
				<td>
					<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/reply_update/<?php echo $reply->idx ?>">수정</a>
					<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/reply_delete/<?php echo $reply->idx ?>">삭제</a>
				</td>
			</li>
			<div style="width:100%;height:10px;"></div>
			<?php endforeach; ?>
			<?php $i++; ?>
		<?php endforeach; ?>
	</ul>
</body>
</html>