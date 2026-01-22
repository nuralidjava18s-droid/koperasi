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
    sel.innerHTML += `<option value="${a.nama}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD DATA BAYAR
===================== */
function loadBayar(){
  const db = getDB();
  const tbody = document.getElementById("listBayar");
  if(!tbody) return;

  const fNama  = document.getElementById("filterAnggotaBayar").value;
  const fBulan = document.getElementById("filterBulanBayar").value;

  tbody.innerHTML = "";

  const data = db.transaksi.filter(t=>t.jenis==="BAYAR");

  if(data.length === 0){
    tbody.innerHTML = `<tr><td colspan="4">Belum ada data angsuran</td></tr>`;
    return;
  }

  data.forEach(t=>{
    if(fNama && t.nama !== fNama) return;
    if(fBulan && !t.tanggal.startsWith(fBulan)) return;

    const pin = db.pinjaman.find(p=>p.id === t.pinjamanId);

    tbody.innerHTML += `
      <tr>
        <td>${t.nama}</td>
        <td>${pin ? rupiah(pin.pokok || pin.jumlah) : "-"}</td>
        <td>${rupiah(t.jumlah)}</td>
        <td>${t.tanggal}</td>
      </tr>`;
  });
}

/* =====================
   INIT
===================== */
document.addEventListener("DOMContentLoaded",()=>{
  loadFilterAnggota();
  loadBayar();
});