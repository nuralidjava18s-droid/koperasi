/* =====================
   STORAGE KOPERASI
===================== */
function getDB(){
  let db = localStorage.getItem("koperasi_db");
  if(!db){
    db = {
      user:{ username:"admin", password:"1234" },
      anggota:[],
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
   AUTH (SATU SAJA)
===================== */
function cekLogin(){
  if(localStorage.getItem("koperasi_login") !== "true"){
    location.href = "index.html";
  }
}

function logout(){
  localStorage.removeItem("koperasi_login");
  location.href = "index.html";
}

/* =====================
   UTIL
===================== */
function rupiah(n){
  return "Rp " + (Number(n) || 0).toLocaleString("id-ID");
}