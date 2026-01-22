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

  // 🔹 Nama file otomatis (tanggal & jam)
  const now = new Date();
  const tgl = now.toISOString().slice(0,10); // 2026-01-18
  const jam = now.toTimeString().slice(0,5).replace(":","-"); // 10-45

  // ⬇️ SEOLAH DI DALAM FOLDER
  const filename = `backup-koperasi-${tgl}-${jam}.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert("✅ Backup berhasil\n" + filename);
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

      // validasi minimal koperasi
      if(!db.user || !db.anggota || !db.kas){
        alert("File backup tidak valid!");
        return;
      }

      localStorage.setItem("koperasi_db", JSON.stringify(db));
      alert("✅ Restore berhasil!");
      location.reload();

    }catch(err){
      alert("❌ File backup rusak / tidak valid!");
    }
  };

  reader.readAsText(file);
}