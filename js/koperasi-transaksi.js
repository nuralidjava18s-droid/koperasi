cekLogin();

/* =====================
   UTIL
===================== */
function rupiah(n){
  return "Rp " + (Number(n) || 0).toLocaleString("id-ID");
}

/* =====================
   LOAD ANGGOTA (UMUM)
===================== */
function loadAnggota(selectId){
  const db = getDB();
  const sel = document.getElementById(selectId);
  if(!sel) return;

  sel.innerHTML = `<option value="">-- Pilih Anggota --</option>`;
  (db.anggota || []).forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================================================
   =================== SIMPANAN =========================
===================================================== */

/* LOAD SIMPANAN */
function loadSimpanan(){
  const db = getDB();
  const tbody = document.getElementById("listSimpanan");
  if(!tbody) return;

  tbody.innerHTML = "";

  (db.simpanan || []).forEach((s,i)=>{
    const a = db.anggota.find(x=>x.id === s.anggota_id);
    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal}</td>
        <td>${a ? a.nama : "-"}</td>
        <td>${s.jenis}</td>
        <td>${rupiah(s.jumlah)}</td>
        <td><button onclick="hapusSimpanan(${i})">🗑️</button></td>
      </tr>
    `;
  });
}

/* SIMPAN SIMPANAN */
function simpanSimpanan(e){
  e.preventDefault();
  const db = getDB();
  if(!Array.isArray(db.simpanan)) db.simpanan = [];

  const anggota_id = anggota.value;
  const jenis = jenis_simpanan.value; // Pokok / Wajib / Sukarela
  const jumlah = Number(jumlah_simpanan.value);
  const tanggal = tanggal_simpanan.value;

  if(!anggota_id || !jenis || !jumlah){
    alert("Lengkapi data simpanan");
    return;
  }

  db.simpanan.push({
    id: "SP" + Date.now(),
    anggota_id,
    jenis,
    jumlah,
    tanggal
  });

  saveDB(db);
  e.target.reset();
  loadSimpanan();
}

/* HAPUS SIMPANAN */
function hapusSimpanan(i){
  if(!confirm("Hapus simpanan?")) return;
  const db = getDB();
  db.simpanan.splice(i,1);
  saveDB(db);
  loadSimpanan();
}

/* =====================================================
   =================== PINJAMAN =========================
===================================================== */

/* LOAD PINJAMAN */
function loadPinjaman(){
  const db = getDB();
  const tbody = document.getElementById("listPinjaman");
  if(!tbody) return;

  tbody.innerHTML = "";

  (db.pinjaman || []).forEach((p,i)=>{
    const a = db.anggota.find(x=>x.id === p.anggota_id);
    tbody.innerHTML += `
      <tr>
        <td>${a ? a.nama : "-"}</td>
        <td>${rupiah(p.jumlah)}</td>
        <td>${p.bunga}%</td>
        <td>${p.tenor}</td>
        <td>${rupiah(p.sisa)}</td>
        <td>${p.status}</td>
        <td>
          <button onclick="bayarPinjaman(${i})">💳 Bayar</button>
        </td>
      </tr>
    `;
  });
}

/* SIMPAN PINJAMAN */
function simpanPinjaman(e){
  e.preventDefault();
  const db = getDB();
  if(!Array.isArray(db.pinjaman)) db.pinjaman = [];

  const anggota_id = anggota_pinjaman.value;
  const jumlah = Number(jumlah_pinjaman.value);
  const bunga = Number(bunga_pinjaman.value);
  const tenor = Number(tenor_pinjaman.value);
  const tanggal = tanggal_pinjaman.value;

  if(!anggota_id || !jumlah || !bunga || !tenor){
    alert("Lengkapi data pinjaman");
    return;
  }

  const total = jumlah + (jumlah * bunga/100 * tenor);
  const angsuran = Math.round(total / tenor);

  db.pinjaman.push({
    id: "PJ" + Date.now(),
    anggota_id,
    jumlah,
    bunga,
    tenor,
    tanggal,
    angsuran,
    sisa: total,
    status: "Aktif"
  });

  saveDB(db);
  e.target.reset();
  loadPinjaman();
}

/* BAYAR PINJAMAN */
function bayarPinjaman(i){
  const db = getDB();
  const p = db.pinjaman[i];

  if(p.status === "Lunas"){
    alert("Pinjaman sudah lunas");
    return;
  }

  p.sisa -= p.angsuran;

  if(p.sisa <= 0){
    p.sisa = 0;
    p.status = "Lunas";
  }

  saveDB(db);
  loadPinjaman();
}

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded", ()=>{
  loadAnggota("anggota");
  loadAnggota("anggota_pinjaman");
  loadSimpanan();
  loadPinjaman();
});