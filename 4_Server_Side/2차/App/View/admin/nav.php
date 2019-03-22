  <section class="content-wrap">
    <div class="container">
      <h3 class="content-title">블로그 관리</h3>
      <nav class="tab-menu">
        <ul>
          <li><a href="<?php echo HOME ?>/admin/menu" <?php if (strpos($param->action, 'menu') !== false): ?> class="active" <?php endif; ?>>메뉴관리</a></li>
          <li><a href="<?php echo HOME ?>/admin/board" <?php if (strpos($param->action, 'board') !== false): ?> class="active" <?php endif; ?>>게시판관리</a></li>
          <?php if ($param->member->id == 'admin'): ?>
          <li><a href="<?php echo HOME ?>/admin/member" <?php if ($param->action == 'member'): ?> class="active" <?php endif; ?>>회원관리</a></li>
          <?php endif; ?>
        </ul>
      </nav>
