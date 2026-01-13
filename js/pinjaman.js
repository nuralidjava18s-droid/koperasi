cekLogin();

/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("anggota");
  if(!sel) return;

  sel.innerHTML = "<option value=''>-- Pilih Anggota --</option>";

  (db.anggota || []).forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   HITUNG ANGSURAN
===================== */
["jumlah","bunga","tenor"].forEach(id=>{
  const el = document.getElementById(id);
  if(el){
    el.addEventListener("input", hitungAngsuran);
  }
});

function hitungAngsuran(){
  const jumlah = Number(document.getElementById("jumlah").value);
  const bunga  = Number(document.getElementById("bunga").value);
  const tenor  = Number(document.getElementById("tenor").value);

  if(jumlah > 0 && bunga > 0 && tenor > 0){
    const totalBunga = jumlah * (bunga / 100) * tenor;
    const total      = jumlah + totalBunga;
    const angsuran   = total / tenor;

    document.getElementById("angsuran").value =
      rupiah(Math.round(angsuran));
  }else{
    document.getElementById("angsuran").value = "";
  }
}

/* =====================
   SIMPAN PINJAMAN
===================== */
function simpanPinjaman(e){
  e.preventDefault();

  const db = getDB();
  if(!Array.isArray(db.pinjaman)) db.pinjaman = [];

  const anggota_id = document.getElementById("anggota").value;
  const jumlah     = Number(document.getElementById("jumlah").value);
  const bunga      = Number(document.getElementById("bunga").value);
  const tenor      = Number(document.getElementById("tenor").value);
  const tanggal    = document.getElementById("tanggal").value;

  if(!anggota_id){
    alert("Pilih anggota");
    return;
  }

  if(!jumlah || jumlah <= 0){
    alert("Jumlah pinjaman tidak valid");
    return;
  }

  if(!bunga || bunga <= 0){
    alert("Bunga tidak valid");
    return;
  }

  if(!tenor || tenor <= 0){
    alert("Tenor tidak valid");
    return;
  }

  const totalBunga = jumlah * (bunga / 100) * tenor;
  const total      = jumlah + totalBunga;

  const id = "PJ" + Date.now(); // ID aman & unik

  db.pinjaman.push({
    id,
    anggota_id,
    jumlah,
    bunga,
    tenor,
    tanggal,
    total,
    sisa: total,
    status: "Aktif"
  });

  saveDB(db);
  e.target.reset();
  document.getElementById("angsuran").value = "";
  loadPinjaman();
}

/* =====================
   LOAD PINJAMAN
===================== */
function loadPinjaman(){
  const db = getDB();
  const tbody = document.getElementById("listPinjaman");
  if(!tbody) return;

  tbody.innerHTML = "";

  (db.pinjaman || []).forEach((p,i)=>{
    const a = (db.anggota || []).find(x=>x.id === p.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${a ? a.nama : "-"}</td>
        <td>${rupiah(p.jumlah)}</td>
        <td>${p.bunga}%</td>
        <td>${p.tenor}</td>
        <td>${rupiah(p.sisa)}</td>
        <td>${p.status}</td>
        <td>
          ${p.status === "Lunas"
            ? "-"
            : `<button onclick="bayarAngsuran(${i})">💳 Bayar</button>`
          }
        </td>
      </tr>
    `;
  });
}

/* =====================
   BAYAR ANGSURAN
===================== */
function bayarAngsuran(index){
  const db = getDB();
  const p = db.pinjaman[index];

  if(p.status === "Lunas"){
    alert("Pinjaman sudah lunas");
    return;
  }

  const angsuran = p.total / p.tenor;
  p.sisa -= angsuran;

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
  loadAnggota();
  loadPinjaman();
});