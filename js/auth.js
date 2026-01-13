/* =====================
   AUTH KOPERASI (FIX)
===================== */

function login(){
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  const db = getDB(); // ← dari storage.js

  if(user === db.user.username && pass === db.user.password){
    localStorage.setItem("koperasi_login","true");
    window.location.href = "dashboard.html";
  }else{
    errorBox.style.display = "block";
    errorBox.innerText = "Username atau password salah";
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