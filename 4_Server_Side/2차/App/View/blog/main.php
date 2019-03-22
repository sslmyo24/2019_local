  <?php if ($menu_list): ?>
  <section class="content-wrap">
    <div class="container">
      <h3 class="content-title"><?php echo $select_menu->name ?></h3>
      <div class="table-wrap board">
      <?php if ($select_menu->reg_board): ?>
        <table>
          <colgroup>
            <col width="10%">
            <col width="50%">
            <col width="20%">
            <col width="20%">
          </colgroup>
          <thead>
            <tr>
              <th>글번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
          <?php foreach ($post_list as $key => $post): ?>
            <?php $reply = "reply".$key; ?>
            <tr>
              <td><?php echo $post->idx ?></td>
              <td><a href="<?php echo HOME ?>/<?php echo $param->userid ?>/view/<?php echo $post->idx ?>"><?php echo $post->title ?></a></td>
              <td><?php echo $post->writer ?></td>
              <td><?php echo $post->date ?></td>
            </tr>
            <?php foreach ($$reply as $reply): ?>
            <tr>
            <tr>
              <td></td>
              <td>&nbsp;&nbsp;└ <a href="<?php echo HOME ?>/<?php echo $param->userid ?>/view/<?php echo $reply->idx ?>"><?php echo $reply->title ?></a></td>
              <td><?php echo $reply->name ?></td>
              <td><?php echo $reply->date ?></td>
            </tr>
            <?php endforeach; ?>
          <?php endforeach; ?>
          </tbody>
        </table>
        <div class="btn-group right">
          <a href="<?php echo HOME ?>/<?php echo $param->userid ?>/post_write/<?php echo $select_menu->reg_board ?>" class="btn main">글작성</a>
        </div>
      <?php else: ?>
        <h2 style="text-align: center;">게시판이 등록되지 않은 메뉴입니다.</h2>
      <?php endif; ?>
      </div>
    </div>
  </section>
<?php endif; ?>
