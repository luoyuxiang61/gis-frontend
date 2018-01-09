//回车事件
document.onkeydown = function (event) {
  var e = event || window.event;
  if (e && e.keyCode == 13) { //回车键的键值为13
    login(); //调用登录按钮的登录事件
  }
};


function login() {

  var userName = md5(document.getElementById('username').value.trim());
  var password = md5(document.getElementById('password').value.trim());
  console.log(userName)
  console.log(password)
  var user;
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
    }
  })

  if (user === null || user == '') {
    alert('用户名或密码错误！');
    return false;
  } else {
    $.removeCookie('user');
    $.cookie('user', user);
    window.location.href = './index.html';
  }

}