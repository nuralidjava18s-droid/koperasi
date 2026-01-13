/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("anggota");
  if(!sel) return;

  sel.innerHTML = "<option value=''>-- Pilih Anggota --</option>";

  (db.anggota || []).forEach(a => {
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD SIMPANAN
===================== */
function loadSimpanan(){
  const db = getDB();
  const tbody = document.getElementById("listSimpanan");
  if(!tbody) return;

  tbody.innerHTML = "";

  (db.simpanan || []).forEach((s, i) => {
    const anggota = (db.anggota || []).find(a => a.id === s.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal || "-"}</td>
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
  if(!Array.isArray(db.simpanan)) db.simpanan = [];

  const anggotaEl = document.getElementById("anggota");
  const jenisEl   = document.getElementById("jenis");
  const jumlahEl  = document.getElementById("jumlah");
  const tanggalEl = document.getElementById("tanggal");

  const anggota_id = anggotaEl ? anggotaEl.value : "";
  const jenis   = jenisEl ? jenisEl.value : "";
  const jumlah  = Number(jumlahEl ? jumlahEl.value : 0);
  const tanggal = tanggalEl ? tanggalEl.value : "";

  if(!anggota_id){
    alert("Pilih anggota");
    return;
  }

  if(!jenis){
    alert("Pilih jenis simpanan (Pokok / Wajib / Sukarela)");
    return;
  }

  if(!jumlah || jumlah <= 0){
    alert("Jumlah tidak valid");
    return;
  }

  const id = "SP" + String(db.simpanan.length + 1).padStart(3,"0");

  db.simpanan.push({
    id,
    anggota_id,
    jenis,
    jumlah,
    tanggal
  });

  saveDB(db);

  if(e.target && e.target.reset){
    e.target.reset();
  }

  loadSimpanan();
}

/* =====================
   HAPUS SIMPANAN
===================== */
function hapusSimpanan(index){
  if(!confirm("Hapus data simpanan ini?")) return;

  const db = getDB();
  if(!Array.isArray(db.simpanan)) db.simpanan = [];

  db.simpanan.splice(index, 1);
  saveDB(db);
  loadSimpanan();
}

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", () => {
  loadAnggota();
  loadSimpanan();
});