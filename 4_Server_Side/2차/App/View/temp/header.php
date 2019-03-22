<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Todo blog</title>
  <link rel="stylesheet" type="text/css" href="<?php echo SRC ?>/css/common.css">
</head>
<body>
  <header class="site-header">
    <div class="top">
      <div class="container util">
      <?php if ($param->is_member): ?>
        <a href="<?php echo HOME ?>/member/logout">로그아웃</a>
        <?php if ($param->member->id !== 'admin'): ?>
        <a href="#" onclick="window.open('<?php echo HOME ?>/<?php echo $param->member->id ?>');">내 블로그</a>
        <?php endif; ?>
        <a href="<?php echo HOME ?>/admin/menu">블로그관리</a>
      <?php else: ?>
        <a href="<?php echo HOME ?>/member/login">로그인</a>
        <a href="<?php echo HOME ?>/member/join">회원가입</a>
      <?php endif; ?>
      </div>
    </div>
    <div class="header-content container">
      <h3 class="logo"><a href="<?php echo HOME ?>/">Todo Blog</a></h3>
    </div>
    <?php if ($param->type == 'blog'): ?>
    <?php require_once _APP."/View/blog/nav.php"; ?>
    <?php endif; ?>
  </header>