  <section class="content-wrap">
    <div class="container">
      <h3 class="content-title">게시물 수정</h3>
      <div class="fields board">
        <form method="post">
          <input type="hidden" name="action" value="post_update">
          <fieldset><legend>글작성</legend>
            <ul>
              <li>
                <div class="lbl"><label for="board-subject">제목</label></div>
                <div class="desc"><input type="text" name="title" id="board-subject" value="<?php echo $post_data->title ?>" class="input full" autofocus></div>
              </li>
              <li>
                <div class="lbl"><label for="board-content">내용</label></div>
                <div class="desc"><textarea name="content" id="board-content" class="input full" cols="80" rows="10"><?php echo $post_data->content ?></textarea></div>
              </li>
            </ul>
            <div class="btn-group">
              <a href="<?php echo HOME ?>/<?php echo $param->userid ?>" class="btn sub">목록으로</a>
              <button type="submit" class="btn main">수정완료</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </section>
ㅍ
