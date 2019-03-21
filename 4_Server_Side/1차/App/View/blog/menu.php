	<h2 class="heading"><?php echo $menu->name ?></h2>
	<?php if ($board_list != null): ?>
		<?php $i = 1; ?>
		<?php foreach ($board_list as $data): ?>
		<h3 class="heading"><?php echo $data->id ?></h2>
		<?php $list_name = "post_list".$i; ?>
		<table class="list" border="1" cellspacing="0">
			<thead>
				<tr>
					<th>제목</th>
					<th>게시날짜</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<?php foreach ($$list_name as $post): ?>
				<tr>
					<td><a href="<?php echo HOME ?>/<?php echo $param->userid ?>/view/<?php echo $post->idx ?>"><?php echo $post->title ?></a></td>
					<td><?php echo $post->date ?></td>
					<td>
						<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/post_update/<?php echo $post->idx ?>">수정</a>
						<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/post_delete/<?php echo $post->idx ?>">삭제</a>
					</td>
				</tr>
				<?php endforeach; ?>
			</tbody>
		</table>
		<div style="display: flex;justify-content: center; ">
			<a href="<?php echo HOME ?>/<?php echo $param->userid ?>/post_insert/<?php echo $data->idx ?>">게시물 등록</a>
		</div>
		<?php $i++; ?>
		<?php endforeach; ?>
	<?php else: ?>
		<h3 class="heading">게시판이 등록되지 않은 메뉴입니다.</h2>
	<?php endif; ?>

	<div style="display: flex;justify-content: center; margin-top: 50px;">
		<a href="<?php echo HOME ?>/<?php echo $param->userid; ?>">메인</a>
	</div>

</body>
</html>