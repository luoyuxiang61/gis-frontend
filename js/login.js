function login() {

  console.log('111111111111111111111jjjjjjjjjjjjjjjjjjjj')

  var userName = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var user;
  console.log(userName);
  console.log(password);
  $.ajax({
    type: 'post',
    url: 'http://localhost:3000/login',
    data: {
      userName: userName,
      password: password
    },
    async: false,
    success: function (res) {
      user = res;
      console.log(res);
    }
  })

  if (user === null) {
    alert('用户名或密码错误！');
    return false;
  } else {
    $.removeCookie('user');
    $.cookie('user', user);
    return true;
  }

}