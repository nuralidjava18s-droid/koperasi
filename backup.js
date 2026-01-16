/* =====================
   BACKUP
===================== */
function backup(){
  const db = getDB();
  const data = JSON.stringify(db, null, 2);

  const blob = new Blob([data], {type:"application/json"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "backup_koperasi.json";
  a.click();

  URL.revokeObjectURL(url);
}

/* =====================
   RESTORE
===================== */
function restore(){
  const file = document.getElementById("fileRestore").files[0];
  if(!file){
    alert("Pilih file backup!");
    return;
  }

  if(!confirm("Data lama akan diganti. Lanjutkan?")) return;

  const reader = new FileReader();
  reader.onload = function(e){
    try{
      const db = JSON.parse(e.target.result);
      localStorage.setItem("koperasiDB", JSON.stringify(db));
      alert("Restore berhasil!");
      location.reload();
    }catch(err){
      alert("File backup tidak valid!");
    }
  };
  reader.readAsText(file);
}