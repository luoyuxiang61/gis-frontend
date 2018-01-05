


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

  user = '1111';
  if(user===null) {
    alert('用户名或密码错误！');
    return false;
  }else{
    $.removeCookie('user');
    $.cookie('user',user);

    return true;
  }
  
  
  
}