	<h2 class="heading">메뉴</h2>
	<table class="list" border="1" cellspacing="0">
		<thead>
			<tr>
				<th>이름</th>
				<th>게시물수</th>
			</tr>
		</thead>
		<tbody>
			<?php $i = 1; ?>
			<?php foreach ($menu_list as $data): ?>
				<?php $sum = "sum".$i; ?>
			<tr>
				<td><a href="<?php echo HOME ?>/<?php echo $param->userid ?>/menu/<?php echo $data->idx ?>"><?php echo $data->name ?></a></td>
				<td><?php echo $$sum; ?></td>
			</tr>
				<?php $i++; ?>
			<?php endforeach; ?>
		</tbody>
	</table>
</body>
</html>