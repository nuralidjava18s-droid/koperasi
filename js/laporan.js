cekLogin();

function rupiah(n){
  return "Rp " + (Number(n)||0).toLocaleString("id-ID");
}

/* LOAD ANGGOTA */
function loadAnggota(){
  const db = getDB();
  anggotaPinjam.innerHTML = `<option value="">-- Pilih Anggota --</option>`;
  db.anggota.forEach(a=>{
    anggotaPinjam.innerHTML += `<option value="${a.nama}">${a.nama}</option>`;
  });
}

/* HITUNG ANGSURAN */
function hitungAngsuran(){
  const j = +jumlahPinjam.value || 0;
  const b = +bungaPinjam.value || 0;
  const t = +tenorPinjam.value || 0;
  if(j && b && t){
    const total = j + (j*b*t/100);
    angsuranPinjam.value = rupiah(Math.ceil(total/t));
  }else angsuranPinjam.value="";
}

jumlahPinjam.oninput =
bungaPinjam.oninput =
tenorPinjam.oninput = hitungAngsuran;

/* SIMPAN PINJAMAN */
formPinjaman.onsubmit = e=>{
  e.preventDefault();
  const db = getDB();
  db.pinjaman.push({
    id:Date.now(),
    nama:anggotaPinjam.value,
    jenis:jenisPinjaman.value,
    jumlah:+jumlahPinjam.value,
    bunga:+bungaPinjam.value,
    tenor:+tenorPinjam.value,
    totalPinjaman:+jumlahPinjam.value+(jumlahPinjam.value*bungaPinjam.value*tenorPinjam.value/100),
    sisa:+jumlahPinjam.value+(jumlahPinjam.value*bungaPinjam.value*tenorPinjam.value/100),
    tanggal:new Date().toISOString().slice(0,10)
  });
  saveDB(db);
  formPinjaman.reset();
  loadPinjaman();
};

/* LOAD TABEL */
function loadPinjaman(){
  const db = getDB();
  listPinjaman.innerHTML="";
  db.pinjaman.forEach(p=>{
    const status = p.sisa<=0 ? "LUNAS" : "BELUM";
    listPinjaman.innerHTML += `
      <tr>
        <td>${p.nama}</td>
        <td>${p.jenis}</td>
        <td>${rupiah(p.totalPinjaman)}</td>
        <td>${rupiah(p.sisa)}</td>
        <td style="color:${status==="LUNAS"?"green":"red"}">${status}</td>
      </tr>`;
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  loadAnggota();
  loadPinjaman();
});