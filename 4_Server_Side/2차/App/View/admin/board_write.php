      <div class="fields board-admin">
        <form method="post">
          <input type="hidden" name="action" value="board_write">
          <fieldset><legend>게시판등록</legend>
            <ul>
              <li>
                <div class="lbl"><label for="board-id">게시판아이디</label></div>
                <div class="desc"><input type="text" name="id" id="board-id" class="input full" autofocus></div>
              </li>
            </ul>
            <div class="btn-group">
              <button type="button" onclick="location.replace('<?php echo HOME ?>/admin/board')" class="btn sub">취소</button>
              <button type="submit" class="btn main">등록</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </section>