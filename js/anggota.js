<script>
/* =====================
   STORAGE
===================== */
function getDB(){
  let db = localStorage.getItem("koperasi_db");
  if(!db){
    db = {
      user:{username:"ali",password:"1234"},
      anggota:[],
      simpanan:[],
      pinjaman:[],
      transaksi:[],
      kas:[]
    };
    localStorage.setItem("koperasi_db",JSON.stringify(db));
  }
  return JSON.parse(db);
}
function saveDB(db){
  localStorage.setItem("koperasi_db",JSON.stringify(db));
}

/* =====================
   ANGGOTA
===================== */
let editIndex = null;

function loadAnggota(){
  const db = getDB();
  const tbody = document.getElementById("listAnggota");

  console.log("DATA ANGGOTA:", db.anggota);

  if(!tbody){
    alert("tbody listAnggota tidak ditemukan");
    return;
  }

  if(db.anggota.length === 0){
    tbody.innerHTML =
      `<tr><td colspan="5" style="text-align:center;color:#777">
        Belum ada anggota
      </td></tr>`;
    return;
  }

  tbody.innerHTML = db.anggota.map((a,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${a.nama}</td>
      <td>${a.alamat}</td>
      <td>${a.telp}</td>
      <td>
        <button onclick="editAnggota(${i})">✏️</button>
        <button onclick="hapusAnggota(${i})">🗑️</button>
      </td>
    </tr>
  `).join("");
}

function simpanAnggota(e){
  e.preventDefault();

  const db = getDB();

  const data = {
    nama: document.getElementById("nama").value.trim(),
    alamat: document.getElementById("alamat").value.trim(),
    telp: document.getElementById("telp").value.trim()
  };

  if(!data.nama || !data.alamat || !data.telp){
    alert("Semua field wajib diisi");
    return;
  }

  if(editIndex === null){
    db.anggota.push(data);
  }else{
    db.anggota[editIndex] = data;
  }

  saveDB(db);
  resetForm();
  loadAnggota();
}

function editAnggota(i){
  const a = getDB().anggota[i];
  document.getElementById("nama").value = a.nama;
  document.getElementById("alamat").value = a.alamat;
  document.getElementById("telp").value = a.telp;
  editIndex = i;
}

function hapusAnggota(i){
  if(!confirm("Hapus anggota ini?")) return;
  const db = getDB();
  db.anggota.splice(i,1);
  saveDB(db);
  loadAnggota();
}

function resetForm(){
  document.getElementById("nama").value="";
  document.getElementById("alamat").value="";
  document.getElementById("telp").value="";
  editIndex=null;
}

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", loadAnggota);
</script>
