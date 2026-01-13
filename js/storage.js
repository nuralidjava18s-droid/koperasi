/* =====================
   STORAGE KOPERASI
===================== */

const DB_KEY = "koperasi_db";

console.log("storage.js LOADED");

function getDB(){
  let raw = localStorage.getItem(DB_KEY);

  // Jika belum ada DB
  if(!raw){
    const initDB = createDefaultDB();
    localStorage.setItem(DB_KEY, JSON.stringify(initDB));
    return initDB;
  }

  // Jika ada tapi rusak
  try{
    const db = JSON.parse(raw);
    return normalizeDB(db);
  }catch(e){
    console.error("DB rusak, reset ulang", e);
    const initDB = createDefaultDB();
    localStorage.setItem(DB_KEY, JSON.stringify(initDB));
    return initDB;
  }
}

function saveDB(db){
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/* =====================
   HELPER
===================== */

function createDefaultDB(){
  return {
    user: {
      username: "admin",
      password: "1234"
    },
    anggota: [],
    simpanan: [],
    pinjaman: [],
    transaksi: [],
    kas: []
  };
}

// Pastikan struktur selalu lengkap
function normalizeDB(db){
  if(!db.user) db.user = { username: "admin", password: "1234" };
  if(!Array.isArray(db.anggota)) db.anggota = [];
  if(!Array.isArray(db.simpanan)) db.simpanan = [];
  if(!Array.isArray(db.pinjaman)) db.pinjaman = [];
  if(!Array.isArray(db.transaksi)) db.transaksi = [];
  if(!Array.isArray(db.kas)) db.kas = [];
  return db;
}