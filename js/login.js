//监听页面的回车事件
document.onkeydown = function (event) {
  var e = event || window.event;
  if (e && e.keyCode == 13) { //回车键的键值为13
    login(); //调用登录按钮的登录事件
  }
};

function login() {
  var userName = document.getElementById('username').value.trim();
  var password = document.getElementById('password').value.trim();
  var user;
  $.ajax({
    type: 'post',
    url: "http://" + serverIP + ":" + serverPort + "/common/login",
    data: {
      userName: userName,
      password: password
    },
    async: false,
    success: function (res) {
      user = res;
    }
  })

  user = JSON.parse(user);

  if (user == null || user == '') {
    alert('用户名或密码错误！');
    return false;
  } else {
    $.removeCookie('user');
    $.cookie('user', JSON.stringify({
      userId: user.id,
      groupId: user.Group.id,
      name: document.getElementById('username').value.trim(),
      UserName: userName,
      Password: password
    }));
    window.location.href = './index.html';
  }

}