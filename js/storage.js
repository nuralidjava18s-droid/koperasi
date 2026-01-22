
/* =====================
   STORAGE KOPERASI
===================== */
const STORAGE_KEY = "koperasi_db";

function getDB(){
  let db = localStorage.getItem(STORAGE_KEY);

  if(!db){
    const initDB = {
      user:{ username:"admin", password:"1234" },
      anggota:[],
      simpanan:[],
      pinjaman:[],
      transaksi:[],
      kas:[]
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initDB));
    return initDB;
  }

  return JSON.parse(db);
}

function saveDB(db){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function logout(){
  localStorage.removeItem("login");
  location.href = "index.html";
}