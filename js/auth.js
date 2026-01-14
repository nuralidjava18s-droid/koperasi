/* =====================
   AUTH KOPERASI
===================== */

function login(){
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  const db = getDB();

  if(user === db.user.username && pass === db.user.password){
    localStorage.setItem("koperasi_login", "true");
    location.href = "dashboard.html";
  }else{
    errorBox.innerText = "Username / password salah";
    errorBox.style.display = "block";
  }
}