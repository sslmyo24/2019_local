    <nav class="gnb">
      <ul>
	  <?php foreach ($menu_list as $data): ?>
	  	<?php $cnt = "post_cnt".$data->name; ?>
        <li><a href="<?php echo HOME ?>/<?php echo $param->userid ?>/main/<?php echo $data->idx ?>"><?php echo $data->name ?> (<?php echo $$cnt; ?>)</a></li>
       <?php endforeach; ?>
      </ul>
    </nav>
