/* =====================
   STORAGE KOPERASI (FINAL & FIX)
===================== */

function getDB(){
  let db = localStorage.getItem("koperasi_db");

  if(!db){
    const initDB = {
      user: {
        username: "ali",
        password: "1234"
      },
      anggota: [],
      simpan: [],
      pinjaman: [],
      transaksi: [],
      kas: []
    };

    localStorage.setItem("koperasi_db", JSON.stringify(initDB));
    return initDB;
  }

  return JSON.parse(db);
}

function saveDB(db){
  localStorage.setItem("koperasi_db", JSON.stringify(db));
}

/* =====================
   HELPER (OPTIONAL)
===================== */

function rupiah(n){
  return "Rp " + (Number(n)||0).toLocaleString("id-ID");
}
