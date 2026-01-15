/* =====================
   DATA ANGGOTA
===================== */

let editIndex = null;

function loadDataAnggota(){
  const db = getDB();
  const tbody = document.getElementById("listAnggota");

  if(db.anggota.length === 0){
    tbody.innerHTML =
      `<tr><td colspan="5">Belum ada data anggota</td></tr>`;
    return;
  }

  tbody.innerHTML = db.anggota.map((a,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${a.nama}</td>
      <td>${a.alamat}</td>
      <td>${a.telp}</td>
      <td class="action">
        <button onclick="editAnggota(${i})">✏️</button>
        <button onclick="hapusAnggota(${i})">🗑️</button>
      </td>
    </tr>
  `).join("");
}

/* =====================
   SIMPAN / UPDATE
===================== */
function simpanAnggota(e){
  e.preventDefault();

  const db = getDB();

  const data = {
    nama: nama.value,
    alamat: alamat.value,
    telp: telp.value
  };

  if(editIndex === null){
    // tambah
    db.anggota.push(data);
  }else{
    // update
    db.anggota[editIndex] = data;
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

  nama.value   = a.nama;
  alamat.value= a.alamat;
  telp.value  = a.telp;

  editIndex = index;
}

/* =====================
   HAPUS
===================== */
function hapusAnggota(index){
  if(!confirm("Hapus anggota ini?")) return;

  const db = getDB();
  db.anggota.splice(index,1);
  saveDB(db);
  loadDataAnggota();
}

/* =====================
   RESET FORM
===================== */
function resetForm(){
  nama.value = "";
  alamat.value = "";
  telp.value = "";
  editIndex = null;
}
