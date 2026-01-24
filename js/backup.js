/* =====================
   BACKUP & RESTORE
===================== */

/* =====================
   BACKUP
===================== */
async function restore(){
  try{
    const [handle] = await window.showOpenFilePicker({
      types: [{
        description: "Backup Koperasi",
        accept: { "application/json": [".json"] }
      }]
    });

    const file = await handle.getFile();
    const text = await file.text();
    let db = JSON.parse(text);

    db.user ??= { username:"admin", password:"1234" };
    db.anggota ??= [];
    db.simpanan ??= [];
    db.pinjaman ??= [];
    db.transaksi ??= [];
    db.kas ??= [];

    localStorage.setItem("koperasi_db", JSON.stringify(db));
    alert("✅ Restore berhasil!");
    location.reload();

  }catch(e){
    alert("❌ Restore dibatalkan");
  }
}
function backup(){
  const db = getDB();

  if(!db){
    alert("Data kosong!");
    return;
  }

  const data = JSON.stringify(db, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const tgl = now.toISOString().slice(0,10);
  const jam = now.toTimeString().slice(0,5).replace(":","-");

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

  if(!input || !input.files.length){
    alert("Pilih file backup terlebih dahulu!");
    return;
  }

  if(!confirm("⚠️ Data lama akan DIGANTI. Lanjutkan?")) return;

  const reader = new FileReader();
  reader.onload = e=>{
    try{
      let db = JSON.parse(e.target.result);

      if(!db || typeof db !== "object"){
        alert("File backup tidak valid!");
        return;
      }

      // normalisasi struktur koperasi
      db.user ??= { username:"admin", password:"1234" };
      db.anggota ??= [];
      db.simpanan ??= [];
      db.pinjaman ??= [];
      db.transaksi ??= [];
      db.kas ??= [];

      localStorage.setItem("koperasi_db", JSON.stringify(db));
      alert("✅ Restore berhasil!");
      location.reload();

    }catch(err){
      alert("❌ File backup rusak!");
    }
  };

  reader.readAsText(input.files[0]);
}