document.addEventListener("DOMContentLoaded", ()=>{
  cekLogin();
  loadAnggota();
  loadSimpanan();
});

/* =====================
   LOAD ANGGOTA
===================== */
function loadAnggota(){
  const db = getDB();
  const sel = document.getElementById("anggota");
  if(!sel) return;

  sel.innerHTML = `<option value="">-- Pilih Anggota --</option>`;

  (db.anggota || []).forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD SIMPANAN
===================== */
function loadSimpanan(){
  const db = getDB();
  const tbody = document.getElementById("listSimpanan");
  if(!tbody) return;

  tbody.innerHTML = "";

  (db.simpanan || []).forEach((s, i)=>{
    const anggota = (db.anggota || []).find(a => a.id === s.anggota_id);

    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal || "-"}</td>
        <td>${anggota ? anggota.nama : "-"}</td>
        <td>${s.jenis}</td>
        <td>${rupiah(s.jumlah)}</td>
        <td>
          <button onclick="hapusSimpanan(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

/* =====================
   SIMPAN SIMPANAN
===================== */
function simpanSimpanan(e){
  e.preventDefault();

  const anggota = document.getElementById("anggota");
  const jenis   = document.getElementById("jenis");
  const jumlah  = document.getElementById("jumlah");
  const tanggal = document.getElementById("tanggal");

  if(!anggota || !jenis || !jumlah || !tanggal){
    alert("Form tidak lengkap");
    return;
  }

  if(!anggota.value){
    alert("Pilih anggota");
    return;
  }

  if(!jenis.value){
    alert("Pilih jenis simpanan");
    return;
  }

  if(Number(jumlah.value) <= 0){
    alert("Jumlah tidak valid");
    return;
  }

  const db = getDB();

  db.simpanan.push({
    id: "SP" + Date.now(),   // ✅ ID aman
    anggota_id: anggota.value,
    jenis: jenis.value,
    jumlah: Number(jumlah.value),
    tanggal: tanggal.value
  });

  saveDB(db);
  e.target.reset();
  loadSimpanan();
}

/* =====================
   HAPUS SIMPANAN
===================== */
function hapusSimpanan(index){
  if(!confirm("Hapus data simpanan ini?")) return;

  const db = getDB();
  db.simpanan.splice(index, 1);
  saveDB(db);
  loadSimpanan();
}