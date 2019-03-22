      <div class="fields menu-admin">
        <form method="post">
          <input type="hidden" name="action" value="menu_write">
          <fieldset><legend>메뉴등록</legend>
            <ul>
              <li>
                <div class="lbl"><label for="menu-title">메뉴이름</label></div>
                <div class="desc"><input type="text" name="name" id="menu-title" class="input full" autofocus></div>
              </li>
            </ul>
            <div class="btn-group">
              <button type="button" onclick="location.replace('<?php echo HOME ?>/admin/menu')" class="btn sub">취소</button>
              <button type="submit" class="btn main">등록</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </section>
