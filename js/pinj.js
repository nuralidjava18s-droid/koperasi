cekLogin();

/* ===================== TAB ===================== */
function openTab(tab){
  document.querySelectorAll('.tabcontent').forEach(t=>t.style.display='none');
  document.querySelectorAll('.tablink').forEach(b=>b.classList.remove('active'));
  document.getElementById(tab).style.display='block';
  event.currentTarget.classList.add('active');
}

/* ===================== UTILS ===================== */
function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* ===================== LOAD ANGGOTA ===================== */
function loadAnggotaDropdowns(){
  const db=getDB();
  ['anggotaPinjam','filterAnggotaPinjam','anggotaBayar','filterAnggotaBayar'].forEach(id=>{
    const sel=document.getElementById(id);
    if(!sel) return;
    sel.innerHTML=`<option value="">-- Pilih Anggota --</option>`;
    db.anggota.forEach(a=>{
      const opt=document.createElement("option");
      opt.value=a.nama;
      opt.textContent=a.nama;
      sel.appendChild(opt);
    });
  });
}

/* ===================== HITUNG ANGSURAN ===================== */
function hitungAngsuran(){
  const jml=+jumlahPinjam.value||0;
  const bunga=+bungaPinjam.value||0;
  const tenor=+tenorPinjam.value||0;
  if(jml && bunga && tenor){
    const total=jml+(jml*bunga*tenor/100);
    angsuranPinjam.value=rupiah(Math.ceil(total/tenor));
  }else angsuranPinjam.value="";
}

jumlahPinjam.oninput=bungaPinjam.oninput=tenorPinjam.oninput=hitungAngsuran;

/* ===================== SIMPAN PINJAMAN ===================== */
function simpanPinjaman(e){
  e.preventDefault();
  const db=getDB(); if(!db.pinjaman) db.pinjaman=[];
  const data={
    id:Date.now(),
    nama:anggotaPinjam.value,
    jenis:jenisPinjaman.value,
    jumlah:+jumlahPinjam.value,
    bunga:+bungaPinjam.value,
    tenor:+tenorPinjam.value,
    tanggal:new Date().toISOString().slice(0,10)
  };
  data.totalPinjaman=data.jumlah+(data.jumlah*data.bunga*data.tenor/100);
  data.sisa=data.totalPinjaman;
  data.angsuran=Math.ceil(data.totalPinjaman/data.tenor);
  db.pinjaman.push(data);
  saveDB(db);
  e.target.reset();
  loadPinjaman();
  loadAnggotaDropdowns();
  alert("Pinjaman tersimpan");
}

/* ===================== PINJAMAN DROPDOWN ===================== */
function loadPinjamanDropdown(){
  const db=getDB();
  const sel=pinjamanBayar;
  sel.innerHTML=`<option value="">-- Pilih Pinjaman --</option>`;
  db.pinjaman
    .filter(p=>p.nama===anggotaBayar.value && p.sisa>0)
    .forEach(p=>{
      sel.innerHTML+=`<option value="${p.id}">
        ${p.nama} - Sisa ${rupiah(p.sisa)}
      </option>`;
    });
}

/* ===================== SIMPAN ANGSURAN ===================== */
function simpanAngsuran(e){
  e.preventDefault();
  const db=getDB(); if(!db.transaksi) db.transaksi=[];
  const pin=db.pinjaman.find(p=>p.id==pinjamanBayar.value);
  if(!pin) return alert("Pinjaman tidak ditemukan");
  pin.sisa-=+jumlahBayar.value;
  if(pin.sisa<0) pin.sisa=0;
  db.transaksi.push({
    id:Date.now(),
    nama:anggotaBayar.value,
    pinjamanId:pin.id,
    jumlah:+jumlahBayar.value,
    jenis:"BAYAR",
    tanggal:new Date().toISOString().slice(0,10)
  });
  saveDB(db);
  e.target.reset();
  loadPinjaman();
  loadBayar();
  loadPinjamanDropdown();
}

/* ===================== LOAD PINJAMAN ===================== */
function loadPinjaman(){
  const db=getDB();
  listPinjaman.innerHTML="";
  db.pinjaman.forEach(p=>{
    const bayar=(db.transaksi||[])
      .filter(t=>t.pinjamanId===p.id)
      .reduce((a,b)=>a+b.jumlah,0);
    const sisa=p.totalPinjaman-bayar;
    listPinjaman.innerHTML+=`
      <tr>
        <td>${p.nama}</td>
        <td>${p.jenis}</td>
        <td>${rupiah(p.totalPinjaman)}</td>
        <td>${rupiah(sisa)}</td>
      </tr>`;
  });
}

/* ===================== LOAD BAYAR ===================== */
function loadBayar(){
  const db=getDB();
  listBayar.innerHTML="";
  (db.transaksi||[]).forEach(t=>{
    const pin=db.pinjaman.find(p=>p.id===t.pinjamanId);
    if(!pin) return;
    listBayar.innerHTML+=`
      <tr>
        <td>${t.nama}</td>
        <td>${rupiah(t.jumlah)}</td>
        <td>${t.tanggal}</td>
      </tr>`;
  });
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded",()=>{
  loadAnggotaDropdowns();
  loadPinjaman();
  loadBayar();
});