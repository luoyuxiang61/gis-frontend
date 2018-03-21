var user = $.cookie('user');
var token = $.cookie('token');
if (user == undefined) window.location.href = 'login.html';
else user = JSON.parse(user);