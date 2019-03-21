<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Todo Blog</title>
	<link rel="stylesheet" href="<?php echo SRC ?>/css/style.css">
	<script href="<?php echo SRC ?>/js/script.js"></script>
</head>
<body>
	<nav id="gnb">
		<ul>
			<?php if ($param->is_member): ?>
			<li><a href="<?php echo HOME ?>/member/logout">로그아웃</a></li>
			<li><a href="<?php echo HOME ?>/<?php echo $param->member->id ?>">내 블로그</a></li>
			<li><a href="<?php echo HOME ?>/blog/config">블로그관리</a></li>
			<?php else: ?>
			<li><a href="<?php echo HOME ?>/member/login">로그인</a></li>
			<li><a href="<?php echo HOME ?>/member/join">회원가입</a></li>
			<?php endif; ?>
		</ul>
	</nav>