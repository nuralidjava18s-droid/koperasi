/* =========================
   BACKUP & RESTORE FILE
   KOPERASI (DOWNLOAD)
========================= */

const DB_KEY = "koperasi_db";

/* =========================
   BACKUP KE FILE
========================= */
function backupToFile(){
  const db = localStorage.getItem(DB_KEY);
  if(!db){
    alert("Data koperasi kosong!");
    return;
  }

  const waktu = new Date();
  const namaFile =
    "backup-koperasi-" +
    waktu.getFullYear() +
    ("0"+(waktu.getMonth()+1)).slice(-2) +
    ("0"+waktu.getDate()).slice(-2) + "-" +
    ("0"+waktu.getHours()).slice(-2) +
    ("0"+waktu.getMinutes()).slice(-2) +
    ".json";

  const blob = new Blob([db], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = namaFile;
  a.click();

  URL.revokeObjectURL(url);

  alert("Backup berhasil disimpan ke folder Download");
}

/* =========================
   RESTORE DARI FILE
========================= */
function restoreFromFile(){
  const input = document.getElementById("restoreFile");
  if(!input || !input.files.length){
    alert("Pilih file backup dulu!");
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e){
    try{
      const data = e.target.result;
      JSON.parse(data); // validasi JSON

      localStorage.setItem(DB_KEY, data);
      alert("Data berhasil direstore");

      location.reload();
    }catch(err){
      alert("File backup tidak valid");
    }
  };

  reader.readAsText(file);
}