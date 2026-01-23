cekLogin();

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   LOAD DROPDOWN FILTER
===================== */
function loadFilterAnggota(){
  const db = getDB();
  const sel = document.getElementById("filterAnggotaBayar");
  if(!sel) return;

  sel.innerHTML = `<option value="">-- Semua Anggota --</option>`;
  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD DATA BAYAR
===================== */
function loadBayar(){
  const db = getDB();
  const tbody = document.getElementById("listBayar");
  if(!tbody) return;

  const fAnggota = document.getElementById("filterAnggotaBayar").value;
  const fBulan   = document.getElementById("filterBulanBayar").value;

  tbody.innerHTML = "";

  if(!db.transaksi || db.transaksi.length === 0){
    tbody.innerHTML = `<tr><td colspan="4">Belum ada data angsuran</td></tr>`;
    return;
  }

  let adaData = false;

  db.transaksi.forEach(t=>{
    if(fAnggota && t.anggota_id !== fAnggota) return;
    if(fBulan && !t.tanggal.startsWith(fBulan)) return;

    const anggota = db.anggota.find(a=>a.id === t.anggota_id);
    const pin = db.pinjaman.find(p=>p.id === t.pinjamanId);

    adaData = true;

    tbody.innerHTML += `
      <tr>
        <td>${anggota?.nama || "-"}</td>
        <td>${pin ? rupiah(pin.jumlah) : "-"}</td>
        <td>${rupiah(t.jumlah)}</td>
        <td>${t.tanggal}</td>
      </tr>
    `;
  });

  if(!adaData){
    tbody.innerHTML = `<tr><td colspan="4">Data tidak ditemukan</td></tr>`;
  }
}

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded",()=>{
  loadFilterAnggota();
  loadBayar();
});
