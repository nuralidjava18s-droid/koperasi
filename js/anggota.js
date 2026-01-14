/* =====================
   GENERATE ID ANGGOTA
===================== */
function generateIdAnggota(){
  const db = getDB();
  let max = 0;

  (db.anggota || []).forEach(a=>{
    const n = parseInt(a.id.replace("AG",""));
    if(!isNaN(n) && n > max) max = n;
  });

  return "AG" + String(max + 1).padStart(3,"0");
}

/* =====================
   LOAD DATA ANGGOTA
===================== */
function loadDataAnggota(){
  const db = getDB();
  const tbody = document.getElementById("listAnggota");
  if(!tbody) return;

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
   SIMPAN / UPDATE ANGGOTA
===================== */
function simpanAnggota(e){
  e.preventDefault();
  const db = getDB();
  if(!Array.isArray(db.anggota)) db.anggota = [];

  const idEl   = document.getElementById("idAnggota");
  const nama   = document.getElementById("nama").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const telp   = document.getElementById("telp").value.trim();

  if(!nama || !alamat || !telp){
    alert("Lengkapi data!");
    return;
  }

  if(idEl.value){
    // UPDATE
    const idx = db.anggota.findIndex(a=>a.id===idEl.value);
    if(idx > -1){
      db.anggota[idx] = {
        id: idEl.value,
        nama,
        alamat,
        telp
      };
    }
  }else{
    // SIMPAN BARU
    db.anggota.push({
      id: generateIdAnggota(),
      nama,
      alamat,
      telp
    });
  }

  saveDB(db);
  resetForm();
  loadDataAnggota();
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
   RESET FORM
===================== */
function resetForm(){
  document.getElementById("idAnggota").value = "";
  document.querySelector("form").reset();
}
