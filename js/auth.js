/* =====================
   AUTH KOPERASI
===================== */

function login(){
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  const db = getDB(); // ambil dari storage.js

  if(user === db.user.username && pass === db.user.password){
    localStorage.setItem("koperasi_login","true");
    window.location.href = "dashboard.html";
  }else{
    errorBox.innerText = "Username / password salah";
    errorBox.style.display = "block";
  }
}

function cekLogin(){
  if(localStorage.getItem("koperasi_login") !== "true"){
    window.location.href = "index.html";
  }
}

function logout(){
  localStorage.removeItem("koperasi_login");
  window.location.href = "index.html";
}