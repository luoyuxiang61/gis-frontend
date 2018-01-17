var user = $.cookie('user')
if (user == undefined) window.location.href = 'login.html';