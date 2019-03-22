      <div class="table-wrap member-admin">
        <table>
          <colgroup>
            <col width="10%">
            <col width="20%">
            <col width="20%">
            <col width="20%">
            <col width="20%">
            <col width="10%">
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>아이디</th>
              <th>이름</th>
              <th>닉네임</th>
              <th>블로그URL</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
          <?php foreach ($member_list as $data): ?>
            <tr>
              <td><?php echo $data->idx ?></td>
              <td><?php echo $data->id ?></td>
              <td><?php echo $data->name ?></td>
              <td><?php echo $data->nick ?></td>
              <td>
              <?php
                echo $_SERVER['REQUEST_SCHEME']."://";
                echo $_SERVER['HTTP_HOST'];
                echo "/".$data->id;
              ?>
              </td>
              <td><a onclick="if (!confirm('정말 삭제 하시겠습니까?')) return false;" href="<?php echo HOME ?>/admin/member_delete/<?php echo $data->idx ?>" class="btn sub mini">삭제</a></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </section>
 