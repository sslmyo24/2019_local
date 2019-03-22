      <div class="table-wrap board-admin">
        <table>
          <colgroup>
            <col width="30%">
            <col width="40%">
            <col width="30%">
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>아이디</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
          <?php foreach ($board_list as $board):  ?>
            <tr>
              <td><?php echo $board->idx ?></td>
              <td><?php echo $board->id ?></td>
              <td><a href="<?php echo HOME ?>/admin/board_delete/<?php echo $board->idx ?>" class="btn sub mini">삭제</a></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
        <div class="btn-group right">
          <a href="<?php echo HOME ?>/admin/board_write" class="btn main">게시판등록</a>
        </div>
      </div>
    </div>
  </section>
