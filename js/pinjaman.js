/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("anggota");
  sel.innerHTML = "<option value=''>-- Pilih Anggota --</option>";

  db.anggota.forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   HITUNG ANGSURAN
===================== */
["jumlah","bunga","tenor"].forEach(id=>{
  document.getElementById(id).addEventListener("input", hitungAngsuran);
});

function hitungAngsuran(){
  const jumlah = Number(document.getElementById("jumlah").value);
  const bunga = Number(document.getElementById("bunga").value);
  const tenor = Number(document.getElementById("tenor").value);

  if(jumlah && bunga && tenor){
    const totalBunga = jumlah * (bunga/100) * tenor;
    const total = jumlah + totalBunga;
    const angsuran = total / tenor;

    document.getElementById("angsuran").value =
      "Rp " + Math.round(angsuran).toLocaleString("id-ID");
  }
}

/* =====================
   SIMPAN PINJAMAN
===================== */

/* ===========/* =====================
   SIMPAN PINJAMAN
===================== */
function simpanPinjaman(e){
  e.preventDefault();

  const db = getDB();
  if(!Array.isArray(db.pinjaman)) db.pinjaman = [];

  const anggota_id = document.getElementById("anggota").value;
  const jumlah = Number(document.getElementById("jumlah").value);
  const tenor = Number(document.getElementById("tenor").value);
  const tanggal = document.getElementById("tanggal").value;

  if(!anggota_id){
    alert("Pilih anggota");
    return;
  }

  if(!jumlah || jumlah <= 0){
    alert("Jumlah pinjaman tidak valid");
    return;
  }

  if(!tenor || tenor <= 0){
    alert("Tenor tidak valid");
    return;
  }

  const id = "PJ" + String(db.pinjaman.length + 1).padStart(3,"0");

  db.pinjaman.push({
    id,
    anggota_id,
    jumlah,
    tenor,
    tanggal,
    sisa: jumlah,
    status: "aktif"
  });

  saveDB(db);
  e.target.reset();
  loadPinjaman();
}==========
   LOAD PINJAMAN
===================== */
function loadPinjaman(){
  const db = getDB();
  const tbody = document.getElementById("listPinjaman");
  tbody.innerHTML="";

  db.pinjaman.forEach((p,i)=>{
    const a = db.anggota.find(x=>x.id===p.anggota_id);

    tbody.innerHTML+=`
      <tr>
        <td>${a ? a.nama : "-"}</td>
        <td>Rp ${p.jumlah.toLocaleString("id-ID")}</td>
        <td>${p.bunga}%</td>
        <td>${p.tenor}</td>
        <td>Rp ${p.sisa.toLocaleString("id-ID")}</td>
        <td>${p.status}</td>
        <td>
          <button onclick="bayarAngsuran(${i})">💳 Bayar</button>
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

  if(p.status==="Lunas"){
    alert("Pinjaman sudah lunas");
    return;
  }

  const total = p.jumlah + (p.jumlah*(p.bunga/100)*p.tenor);
  const angsuran = total / p.tenor;

  p.sisa -= angsuran;

  if(p.sisa <= 0){
    p.sisa = 0;
    p.status = "Lunas";
  }

  saveDB(db);
  loadPinjaman();
}
