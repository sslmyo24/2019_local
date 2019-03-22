      <div class="table-wrap menu-admin">
        <table>
          <colgroup>
            <col width="10%">
            <col width="30%">
            <col width="50%">
            <col width="10%">
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>메뉴이름</th>
              <th>연동게시판</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
          <?php foreach ($menu_list as $menu):  ?>
            <tr>
              <td><?php echo $menu->idx ?></td>
              <td><?php echo $menu->name ?></td>
              <td>
                <form method="post">
                  <input type="hidden" name="action" value="reg_board">
                  <input type="hidden" name="midx" value="<?php echo $menu->idx ?>">
                  <select name="bidx" class="input">
                    <option value="">게시판선택</option>
                  <?php foreach ($board_list as $board): ?>
                    <option value="<?php echo $board->idx ?>"><?php echo $board->id ?></option>
                  <?php endforeach; ?>
                  </select>
                  <button type="submit" class="btn main mini">등록</button>
                </form>
              </td>
              <td><a href="<?php echo HOME ?>/admin/menu_delete/<?php echo $menu->idx ?>" class="btn sub mini">삭제</a></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
        <div class="btn-group right">
          <a href="<?php echo HOME ?>/admin/menu_write" class="btn main">메뉴등록</a>
        </div>
      </div>
    </div>
  </section>
