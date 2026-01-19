cekLogin();

/* ===================== TAB ===================== */
function openTab(tab){
  document.querySelectorAll('.tabcontent').forEach(t=>t.style.display='none');
  document.querySelectorAll('.tablink').forEach(b=>b.classList.remove('active'));
  document.getElementById(tab).style.display='block';
  event.currentTarget.classList.add('active');
}

/* ===================== UTIL ===================== */
function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* ===================== LOAD ANGGOTA ===================== */
function loadAnggotaDropdowns(){
  const db = getDB();
  const ids = [
    'anggotaPinjam',
    'filterAnggotaPinjam',
    'anggotaBayar',
    'filterAnggotaBayar'
  ];

  ids.forEach(id=>{
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = `<option value="">-- Pilih Anggota --</option>`;
    db.anggota.forEach(a=>{
      sel.innerHTML += `<option value="${a.nama}">${a.nama}</option>`;
    });
  });
}

/* ===================== HITUNG ANGSURAN ===================== */
function hitungAngsuran(){
  const jumlah = Number(jumlahPinjam.value || 0);
  const tenor  = Number(tenorPinjam.value || 0);

  // sementara bunga = 0
  if(jumlah && tenor){
    angsuranPinjam.value = rupiah(Math.ceil(jumlah / tenor));
  }else{
    angsuranPinjam.value = "";
  }
}

jumlahPinjam.addEventListener("input", hitungAngsuran);
tenorPinjam.addEventListener("input", hitungAngsuran);

/* ===================== SIMPAN PINJAMAN ===================== */
function simpanPinjaman(e){
  e.preventDefault();
  const db = getDB();
  db.pinjaman ??= [];

  const data = {
    id: Date.now(),
    nama: anggotaPinjam.value,
    pokok: Number(jumlahPinjam.value),
    bunga: 0,
    tenor: Number(tenorPinjam.value),
    angsuran: Math.ceil(jumlahPinjam.value / tenorPinjam.value),
    sisa: Number(jumlahPinjam.value),
    tanggal: new Date().toISOString().slice(0,10)
  };

  db.pinjaman.push(data);
  saveDB(db);

  e.target.reset();
  loadPinjaman();
  loadPinjamanDropdown();
  alert("Pinjaman berhasil disimpan");
}

/* ===================== DROPDOWN PINJAMAN ===================== */
function loadPinjamanDropdown(){
  const db = getDB();
  const sel = pinjamanBayar;
  sel.innerHTML = `<option value="">-- Pilih Pinjaman --</option>`;

  db.pinjaman
    .filter(p=>p.nama===anggotaBayar.value && p.sisa>0)
    .forEach(p=>{
      sel.innerHTML += `
        <option value="${p.id}">
          ${p.nama} - Sisa ${rupiah(p.sisa)}
        </option>`;
    });
}

/* ===================== SIMPAN ANGSURAN ===================== */
function simpanAngsuran(e){
  e.preventDefault();
  const db = getDB();
  db.transaksi ??= [];

  const pin = db.pinjaman.find(p=>p.id == pinjamanBayar.value);
  if(!pin) return alert("Pinjaman tidak ditemukan");

  const bayar = Number(jumlahBayar.value);
  pin.sisa -= bayar;
  if(pin.sisa < 0) pin.sisa = 0;

  db.transaksi.push({
    id: Date.now(),
    nama: pin.nama,
    pinjamanId: pin.id,
    pokok: bayar,
    bunga: 0,
    jenis: "ANGSURAN",
    tanggal: new Date().toISOString().slice(0,10)
  });

  saveDB(db);
  e.target.reset();
  loadPinjaman();
  loadBayar();
  loadPinjamanDropdown();
  alert("Angsuran berhasil dicatat");
}

/* ===================== TABEL PINJAMAN ===================== */
function loadPinjaman(){
  const db = getDB();
  listPinjaman.innerHTML = "";

  db.pinjaman.forEach(p=>{
    const totalBayar = db.transaksi
      .filter(t=>t.pinjamanId===p.id)
      .reduce((a,b)=>a+b.pokok,0);

    const sisa = p.pokok - totalBayar;
    const status = sisa<=0 ? "LUNAS" : "BELUM";

    listPinjaman.innerHTML += `
      <tr>
        <td>${p.nama}</td>
        <td>${rupiah(p.pokok)}</td>
        <td>0%</td>
        <td>${p.tenor} bln</td>
        <td>${rupiah(totalBayar)}</td>
        <td>${rupiah(sisa)}</td>
        <td style="color:${status==="LUNAS"?"green":"red"}">${status}</td>
      </tr>`;
  });
}

/* ===================== TABEL ANGSURAN ===================== */
function loadBayar(){
  const db = getDB();
  listBayar.innerHTML = "";

  db.transaksi.forEach(t=>{
    listBayar.innerHTML += `
      <tr>
        <td>${t.nama}</td>
        <td>${rupiah(t.pokok)}</td>
        <td>0</td>
        <td>${t.tanggal}</td>
      </tr>`;
  });
}

/* ===================== INIT ===================== */
loadAnggotaDropdowns();
loadPinjaman();
loadBayar();