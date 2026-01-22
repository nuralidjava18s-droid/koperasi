document.addEventListener("DOMContentLoaded", () => {
  loadAnggota();
  loadPinjaman();
});

/* =====================
   UTIL
===================== */
function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("anggotaPinjam");
  if(!sel) return;

  sel.innerHTML = `<option value="">-- Pilih Anggota --</option>`;
  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   HITUNG ANGSURAN
===================== */
function hitungAngsuran(){
  const j = Number(jumlahPinjam.value||0);
  const t = Number(tenorPinjam.value||0);
  if(j && t){
    angsuranPinjam.value = rupiah(Math.ceil(j/t));
  }else{
    angsuranPinjam.value = "";
  }
}

jumlahPinjam.addEventListener("input", hitungAngsuran);
tenorPinjam.addEventListener("input", hitungAngsuran);

/* =====================
   SIMPAN PINJAMAN
===================== */
document.getElementById("formPinjaman").addEventListener("submit", e=>{
  e.preventDefault();
  const db = getDB();

  db.pinjaman.push({
    id: Date.now(),
    anggota_id: anggotaPinjam.value,
    jumlah: Number(jumlahPinjam.value),
    bunga: Number(bungaPinjam.value),
    tenor: Number(tenorPinjam.value),
    sisa: Number(jumlahPinjam.value),
    tanggal: new Date().toISOString().slice(0,10)
  });

  saveDB(db);
  e.target.reset();
  loadPinjaman();
});

/* =====================
   LOAD PINJAMAN
===================== */
function loadPinjaman(){
  const db = getDB();
  const tbody = document.getElementById("listPinjaman");
  tbody.innerHTML = "";

  db.pinjaman.forEach(p=>{
    const anggota = db.anggota.find(a=>a.id===p.anggota_id);
    tbody.innerHTML += `
      <tr>
        <td>${anggota?.nama || "-"}</td>
        <td>${rupiah(p.jumlah)}</td>
        <td>${p.tenor} bln</td>
        <td>${rupiah(p.sisa)}</td>
        <td style="color:${p.sisa<=0?'green':'red'}">
          ${p.sisa<=0?'LUNAS':'AKTIF'}
        </td>
      </tr>`;
  });
}