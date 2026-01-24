/* =====================
   LOAD ANGGOTA KE SELECT
===================== */
function loadAnggota(){
  const db = getDB();
  const select = document.getElementById("anggota");

  select.innerHTML = "<option value=''>-- Pilih Anggota --</option>";

  (db.anggota || []).forEach(a=>{
    select.innerHTML += `
      <option value="${a.id}">${a.nama}</option>
    `;
  });
}

/* =====================
   LOAD SIMPANAN
===================== */
function loadSimpanan(){
  const db = getDB();
  const tbody = document.getElementById("listSimpanan");
  tbody.innerHTML = "";

  (db.simpanan || []).forEach((s, i)=>{
    const anggota = db.anggota.find(a => a.id === s.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal}</td>
        <td>${anggota ? anggota.nama : "-"}</td>
        <td>${s.jenis}</td>
        <td>Rp ${Number(s.jumlah).toLocaleString("id-ID")}</td>
        <td>
          <button onclick="hapusSimpanan(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   SIMPAN SIMPANAN
===================== */
function simpanSimpanan(e){
  e.preventDefault();

  const db = getDB();

  const anggota_id = document.getElementById("anggota").value;
  const jenis      = document.getElementById("jenis").value;
  const jumlah     = document.getElementById("jumlah").value;
  const tanggal    = document.getElementById("tanggal").value;

  if(!anggota_id || !jumlah || !tanggal){
    alert("Data belum lengkap");
    return;
  }

  db.simpanan.push({
    id: Date.now(),
    anggota_id,
    jenis,
    jumlah: Number(jumlah),
    tanggal
  });

  saveDB(db);
  loadSimpanan();
  e.target.reset();
}

/* =====================
   HAPUS SIMPANAN
===================== */
function hapusSimpanan(index){
  if(confirm("Hapus data simpanan ini?")){
    const db = getDB();
    db.simpanan.splice(index,1);
    saveDB(db);
    loadSimpanan();
  }
}