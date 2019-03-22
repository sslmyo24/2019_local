  <section class="content-wrap">
    <div class="container">
      <h3 class="content-title">댓글 수정</h3>
      <div class="fields board">
        <form method="post">
          <input type="hidden" name="action" value="comment_update">
          <fieldset><legend>글작성</legend>
            <ul>
              <li>
                <div class="lbl"><label for="board-content">내용</label></div>
                <div class="desc"><textarea name="content" id="board-content" class="input full" cols="80" rows="10"><?php echo $comment_data->content ?></textarea></div>
              </li>
            </ul>
            <div class="btn-group">
              <a href="<?php echo HOME ?>/<?php echo $param->userid ?>" class="btn sub">목록으로</a>
              <button type="submit" class="btn main">작성완료</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </section>
ㅍ
