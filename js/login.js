var $btn = document.getElementById("submit");
var $form = document.getElementById("form")

function signIn() {
  if ($form.checkValidity()) {
    $btn.classList.add('pending');
    window.setTimeout(function(){ $btn.classList.add('granted');
  }, 500);
  }

  window.location.href="./index.html";
}

$btn.addEventListener("click", signIn);