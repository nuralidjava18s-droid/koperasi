/* =========================
   AUTH KOPERASI - FINAL
   Anti BACK / Anti Jebol
========================= */

/* =========================
   LOGIN
========================= */
function login(){
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("error");

  if(!user || !pass){
    errorBox.style.display = "block";
    errorBox.innerText = "Username & password wajib diisi";
    return;
  }

  const db = getDB();

  if(user === db.user.username && pass === db.user.password){
    localStorage.setItem("login", "true");
    localStorage.setItem("login_user", user);

    // hapus history login
    window.location.replace("dashboard.html");
  }else{
    errorBox.style.display = "block";
    errorBox.innerText = "Username atau password salah";
  }
}

/* =========================
   CEK LOGIN (WAJIB DI SEMUA HALAMAN)
========================= */
function cekLogin(){
  if(localStorage.getItem("login") !== "true"){
    window.location.replace("login.html");
  }

  // anti tombol BACK Android
  history.pushState(null, null, location.href);
  window.onpopstate = function(){
    history.go(1);
  };
}

/* =========================
   LOGOUT
========================= */
function logout(){
  if(confirm("Yakin ingin logout?")){
    localStorage.removeItem("login");
    localStorage.removeItem("login_user");

    // hapus history agar BACK tidak bisa
    window.location.replace("login.html");
  }
}

/* =========================
   PROTEKSI REFRESH / CACHE
========================= */
window.addEventListener("pageshow", function(e){
  if(e.persisted){
    if(localStorage.getItem("login") !== "true"){
      window.location.replace("login.html");
    }
  }
});