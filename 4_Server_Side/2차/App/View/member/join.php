  <section class="content-wrap">
    <div class="container">
      <h3 class="content-title">회원가입</h3>
      <div class="fields login">
        <form method="post">
          <input type="hidden" name="action" value="join">
          <fieldset><legend>회원가입 폼</legend>
            <ul>
              <li>
                <div class="lbl"><label for="login-id">아이디</label></div>
                <div class="desc"><input type="text" name="id" id="login-id" class="input full" autofocus></div>
              </li>
              <li>
                <div class="lbl"><label for="login-pw">비밀번호</label></div>
                <div class="desc"><input type="password" name="pw" id="login-pw" class="input full"></div>
              </li>
              <li>
                <div class="lbl"><label for="login-name">이름</label></div>
                <div class="desc"><input type="text" name="name" id="login-name" class="input full"></div>
              </li>
              <li>
                <div class="lbl"><label for="login-nick">닉네임</label></div>
                <div class="desc"><input type="text" name="nick" id="login-nick" class="input full"></div>
              </li>
            </ul>
            <div class="btn-group">
              <button type="submit" class="btn main big">회원가입</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </section>
