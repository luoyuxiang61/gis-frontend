// var working = false;
// $('.login').on('submit', function(e) {
//   e.preventDefault();


//   if (working) return;
//   working = true;
//   var $this = $(this),
//     $state = $this.find('button > .state');
//   $this.addClass('loading');
//   $state.html('验证中');
//   setTimeout(function() {
//     $this.addClass('ok');
//     $state.html('登录成功!');
    
//     setTimeout(function() {
//       $state.html('进入主页');
//       $this.removeClass('ok loading');
//       working = false;
//       window.location.href="./index.html";
//     }, 1000);
//   }, 2000);
// });



$.ajaxSetup (
  {
     async: false
  });



function checkUser(){
  var userName = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var user;
  console.log(userName);
  console.log(password);
  $.post("http://localhost:3000/test?userName="+userName+"&password="+password,function(data){  
    user = data;
  })

  if(user===null) {
    alert('用户名或密码错误！');
    return false;
  }else{
    $.removeCookie('user');
    $.cookie('user',user);

    return true;
  }
  
  
  
}