document.addEventListener("DOMContentLoaded", ()=>{
  loadAnggota();
  loadBayar();
});

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = anggotaBayar;
  sel.innerHTML = `<option value="">-- Pilih Anggota --</option>`;
  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

anggotaBayar.addEventListener("change", ()=>{
  const db = getDB();
  pinjamanBayar.innerHTML = `<option value="">-- Pilih Pinjaman --</option>`;
  db.pinjaman
    .filter(p=>p.anggota_id===anggotaBayar.value && p.sisa>0)
    .forEach(p=>{
      pinjamanBayar.innerHTML += `
        <option value="${p.id}">
          Sisa ${rupiah(p.sisa)}
        </option>`;
    });
});

/* =====================
   SIMPAN ANGSURAN
===================== */
formAngsuran.addEventListener("submit", e=>{
  e.preventDefault();
  const db = getDB();

  const pin = db.pinjaman.find(p=>p.id==pinjamanBayar.value);
  const bayar = Number(jumlahBayar.value);

  pin.sisa -= bayar;
  if(pin.sisa < 0) pin.sisa = 0;

  db.transaksi.push({
    id: Date.now(),
    anggota_id: anggotaBayar.value,
    pinjamanId: pin.id,
    jumlah: bayar,
    tanggal: new Date().toISOString().slice(0,10)
  });

  saveDB(db);
  e.target.reset();
  loadBayar();
});

/* =====================
   LOAD RIWAYAT
===================== */
function loadBayar(){
  const db = getDB();
  listBayar.innerHTML = "";
  db.transaksi.forEach(t=>{
    const a = db.anggota.find(x=>x.id===t.anggota_id);
    listBayar.innerHTML += `
      <tr>
        <td>${a?.nama||"-"}</td>
        <td>${rupiah(t.jumlah)}</td>
        <td>${t.tanggal}</td>
      </tr>`;
  });
}