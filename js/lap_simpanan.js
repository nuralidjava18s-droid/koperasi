/* =====================
   UTIL
===================== */
function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   DROPDOWN ANGGOTA
===================== */
function loadFilterAnggota(){
  const db = getDB();
  const sel = document.getElementById("filterAnggota");

  sel.innerHTML = `<option value="">-- Semua Anggota --</option>`;

  (db.anggota || []).forEach(a=>{
    sel.innerHTML += `<option value="${a.id}">${a.nama}</option>`;
  });
}

/* =====================
   LOAD SIMPANAN FILTER
===================== */
function loadSimpananFilter(){
  const db = getDB();
  const fAnggota = document.getElementById("filterAnggota").value;
  const fJenis   = document.getElementById("filterJenis").value;
  const tbody    = document.getElementById("listSimpanan");

  tbody.innerHTML = "";
  let total = 0;

  (db.simpanan || [])
    .filter(s => !fAnggota || s.anggota_id == fAnggota)
    .filter(s => !fJenis || s.jenis === fJenis)
    .forEach(s=>{
      const anggota = db.anggota.find(a=>a.id==s.anggota_id);
      total += Number(s.jumlah||0);

      tbody.innerHTML += `
        <tr>
          <td>${s.tanggal}</td>
          <td>${anggota ? anggota.nama : "-"}</td>
          <td>${s.jenis}</td>
          <td>${rupiah(s.jumlah)}</td>
        </tr>`;
    });

  document.getElementById("totalSimpanan").innerText = rupiah(total);
}