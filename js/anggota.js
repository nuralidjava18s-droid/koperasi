/* =====================
   LOAD DATA ANGGOTA (TABLE)
===================== */
function loadDataAnggota(){
  const db = getDB();
  const tbody = document.getElementById("listAnggota");
  tbody.innerHTML = "";

  (db.anggota || []).forEach((a, i)=>{
    tbody.innerHTML += `
      <tr>
        <td>${a.id}</td>
        <td>${a.nama}</td>
        <td>${a.alamat}</td>
        <td>${a.telp}</td>
        <td class="action">
          <button onclick="editAnggota(${i})">✏️</button>
          <button onclick="hapusAnggota(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   SIMPAN / UPDATE
===================== */
function simpanAnggota(e){
  e.preventDefault();
  const db = getDB();
  if(!Array.isArray(db.anggota)) db.anggota = [];

  const idEl = document.getElementById("idAnggota");
  const nama = document.getElementById("nama").value;
  const alamat = document.getElementById("alamat").value;
  const telp = document.getElementById("telp").value;

  if(idEl.value){
    // UPDATE
    const idx = db.anggota.findIndex(a=>a.id===idEl.value);
    if(idx>-1){
      db.anggota[idx].nama = nama;
      db.anggota[idx].alamat = alamat;
      db.anggota[idx].telp = telp;
    }
  }else{
    // TAMBAH BARU
    db.anggota.push({
      id: "AG" + Date.now(),
      nama,
      alamat,
      telp
    });
  }

  saveDB(db);
  resetForm();
  loadDataAnggota();   // ⬅️ WAJIB
}

/* =====================
   EDIT
===================== */
function editAnggota(index){
  const db = getDB();
  const a = db.anggota[index];

  document.getElementById("idAnggota").value = a.id;
  document.getElementById("nama").value = a.nama;
  document.getElementById("alamat").value = a.alamat;
  document.getElementById("telp").value = a.telp;
}

/* =====================
   HAPUS
===================== */
function hapusAnggota(index){
  if(confirm("Hapus anggota ini?")){
    const db = getDB();
    db.anggota.splice(index,1);
    saveDB(db);
    loadDataAnggota();
  }
}

/* =====================
   RESET
===================== */
function resetForm(){
  document.getElementById("idAnggota").value = "";
  document.querySelector("form").reset();
}
