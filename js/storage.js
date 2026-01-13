/* =====================
STORAGE KOPERASI (FINAL & FIX)
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




/* =====================
HELPER (OPTIONAL)
===================== */

function rupiah(n){
return "Rp " + (Number(n)||0).toLocaleString("id-ID");
}
