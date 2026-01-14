/* =====================
   LOAD ANGGOTA (DROPDOWN)
===================== */
function loadAnggotaPinjaman(){
  const db = getDB();
  const sel = document.getElementById("anggotaPinjam");
  if(!sel) return;

  sel.innerHTML = "<option value=''>-- Pilih Anggota --</option>";

  (db.anggota || []).forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   HITUNG ANGSURAN
===================== */
function hitungAngsuran(){
  const jumlah = Number(document.getElementById("jumlahPinjam")?.value || 0);
  const bunga = Number(document.getElementById("bungaPinjam")?.value || 0);
  const tenor = Number(document.getElementById("tenorPinjam")?.value || 0);

  if(jumlah <= 0 || tenor <= 0) return;

  const totalBunga = jumlah * (bunga/100);
  const totalBayar = jumlah + totalBunga;
  const angsuran = totalBayar / tenor;

  const out = document.getElementById("angsuran");
  if(out){
    out.value = Math.round(angsuran);
  }
}

/* =====================
   SIMPAN PINJAMAN
===================== */
function simpanPinjaman(e){
  e.preventDefault();

  const db = getDB();
  if(!Array.isArray(db.pinjaman)) db.pinjaman = [];

  const anggota_id = document.getElementById("anggotaPinjam").value;
  const jumlah = Number(document.getElementById("jumlahPinjam").value);
  const bunga = Number(document.getElementById("bungaPinjam").value);
  const tenor = Number(document.getElementById("tenorPinjam").value);
  const tanggal = document.getElementById("tanggalPinjam").value;
  const angsuran = Number(document.getElementById("angsuran").value);

  if(!anggota_id){
    alert("Pilih anggota");
    return;
  }

  if(jumlah <= 0 || tenor <= 0){
    alert("Jumlah / tenor tidak valid");
    return;
  }

  db.pinjaman.push({
    id: "PJ" + Date.now(),
    anggota_id,
    jumlah,
    bunga,
    tenor,
    angsuran,
    sisa: jumlah,
    tanggal,
    status: "Aktif"
  });

  saveDB(db);
  e.target.reset();
  loadPinjaman();

  alert("Pinjaman berhasil disimpan");
}

/* =====================
   LOAD PINJAMAN
===================== */
function loadPinjaman(){
  const db = getDB();
  if(!Array.isArray(db.pinjaman)) db.pinjaman = [];

  const tbody = document.getElementById("listPinjaman");
  if(!tbody) return;

  tbody.innerHTML = "";

  db.pinjaman.forEach((p,i)=>{
    const anggota = (db.anggota||[]).find(a=>a.id===p.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${p.tanggal}</td>
        <td>${anggota ? anggota.nama : "-"}</td>
        <td>${rupiah(p.jumlah)}</td>
        <td>${p.tenor} bln</td>
        <td>${rupiah(p.angsuran)}</td>
        <td>${rupiah(p.sisa)}</td>
        <td>${p.status}</td>
        <td>
          <button onclick="hapusPinjaman(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   HAPUS PINJAMAN
===================== */
function hapusPinjaman(index){
  if(confirm("Hapus data pinjaman ini?")){
    const db = getDB();
    db.pinjaman.splice(index,1);
    saveDB(db);
    loadPinjaman();
  }
}

/* =====================
   EVENT AMAN (ANTI ERROR)
===================== */
["jumlahPinjam","bungaPinjam","tenorPinjam"].forEach(id=>{
  const el = document.getElementById(id);
  if(el){
    el.addEventListener("input", hitungAngsuran);
  }
});

/* =====================
   INIT
===================== */
window.onload = function(){
  loadAnggotaPinjaman();
  loadPinjaman();
};
