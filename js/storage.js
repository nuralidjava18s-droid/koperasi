/* =====================
   STORAGE KOPERASI
===================== */

function getDB(){
  let db = localStorage.getItem("koperasi_db");

  if(!db){
    db = {
      user:{ username:"admin", password:"1234" },
      anggota:[],
      simpanan:[],
      pinjaman:[],
      transaksi:[],
      kas:[]
    };
    localStorage.setItem("koperasi_db", JSON.stringify(db));
  }

  return JSON.parse(db);
}

function saveDB(db){
  localStorage.setItem("koperasi_db", JSON.stringify(db));
}

/* =====================
   LOGIN
===================== */

function cekLogin(){
  const login = localStorage.getItem("login");
  if(!login){
    location.href = "login.html";
  }
}

function logout(){
  if(confirm("Yakin ingin logout?")){
    localStorage.removeItem("login");
    location.href = "login.html";
  }
}

/* =====================
   UTIL
===================== */

function rupiah(n){
  return "Rp " + (Number(n) || 0).toLocaleString("id-ID");
}