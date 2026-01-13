/* =====================
   AUTH KOPERASI (GITHUB SAFE)
===================== */

/* =====================
   LOGIN
===================== */
function login(e){
    if(e) e.preventDefault();

    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("error");

    if(!user || !pass){
        showError("Username & password wajib diisi");
        return;
    }

    const db = getDB(); // 🔥 PAKAI DARI storage.js

    if(user === db.user.username && pass === db.user.password){
        localStorage.setItem("koperasi_login", "true");
        localStorage.setItem("koperasi_user", user);
        window.location.href = "dashboard.html";
    }else{
        showError("Username atau password salah");
    }
}

/* =====================
   CEK LOGIN
===================== */
function cekLogin(){
    if(localStorage.getItem("koperasi_login") !== "true"){
        window.location.href = "index.html";
    }
}

/* =====================
   LOGOUT
===================== */
function logout(){
    if(confirm("Yakin ingin logout?")){
        localStorage.removeItem("koperasi_login");
        localStorage.removeItem("koperasi_user");
        window.location.href = "index.html";
    }
}

/* =====================
   HELPER
===================== */
function showError(msg){
    const errorBox = document.getElementById("error");
    if(errorBox){
        errorBox.style.display = "block";
        errorBox.innerText = msg;
    }else{
        alert(msg);
    }
}