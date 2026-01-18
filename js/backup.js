/* =====================
   BACKUP & RESTORE
   SINKRON STORAGE
===================== */

const STORAGE_KEY = "koperasi_db";

/* =====================
   BACKUP
===================== */
function backup(){
  const db = getDB();

  if(!db){
    alert("Data kosong!");
    return;
  }

  const data = JSON.stringify(db, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_koperasi.json";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =====================
   RESTORE
===================== */
function restore(){
  const input = document.getElementById("fileRestore");
  const file = input.files[0];

  if(!file){
    alert("Pilih file backup terlebih dahulu!");
    return;
  }

  if(!confirm("⚠️ Data lama akan DIGANTI. Lanjutkan?")) return;

  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const db = JSON.parse(e.target.result);

      // validasi struktur minimal
      if(!db.user || !db.anggota){
        alert("File backup tidak valid!");
        return;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));

      alert("✅ Restore berhasil!");
      location.reload();
    }catch(err){
      alert("❌ File backup rusak / tidak valid!");
    }
  };

  reader.readAsText(file);
}