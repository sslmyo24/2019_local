  <section class="content-wrap">
    <div class="container">
      <h3 class="content-title">게시물 목록</h3>
      <div class="fields board">
        <ul>
          <li>
            <div class="lbl">제목</div>
            <div class="desc"><?php echo $post_data->title ?></div>
          </li>
          <li>
            <div class="lbl">작성일</div>
            <div class="desc"><?php echo $post_data->date ?></div>
          </li>
          <li>
            <div class="lbl">내용</div>
            <div class="desc">
              <?php echo $post_data->content ?>
            </div>
          </li>
        </ul>
        <div class="btn-group right">
          <a href="<?php echo HOME ?>/<?php echo $param->userid ?>" class="btn sub">목록</a>
          <a href="<?php echo HOME ?>/<?php echo $param->userid ?>/reply_write/<?php echo $param->idx ?>" class="btn main">답글</a>
          <a href="<?php echo HOME ?>/<?php echo $param->userid ?>/post_update/<?php echo $param->idx ?>" class="btn main">수정</a>
          <a href="<?php echo HOME ?>/<?php echo $param->userid ?>/post_delete/<?php echo $param->idx ?>" class="btn main">삭제</a>
        </div>
      </div>
      <div class="comment">
        <h4>댓글목록</h3>
        <ul>
          <li class="comment-write">
            <form method="post">
              <input type="hidden" name="action" value="comment_write">
              <p><strong><?php echo $param->member->nick ?></strong></p>
              <p><textarea name="content" cols="80" rows="5" class="input full"></textarea></p>
              <p><button type="submit" class="btn main">작성완료</button></p>
            </form>
          </li>
        <?php foreach ($comment_list as $data): ?>
          <li>
            <p>
              <strong class="writer"><?php echo $data->nick ?></strong>
              <span class="date"><?php echo $data->date ?></span>
            </p>
            <div class="text"><?php echo $data->content ?></div>
            <a href="<?php echo HOME ?>/<?php echo $param->userid ?>/comment_update/<?php echo $data->idx ?>" class="btn main">수정</a>
            <a href="<?php echo HOME ?>/<?php echo $param->userid ?>/comment_delete/<?php echo $data->idx ?>" class="btn main">삭제</a>
          </li>
        <?php endforeach; ?>
        </ul>
      </div>
    </div>
  </section>
