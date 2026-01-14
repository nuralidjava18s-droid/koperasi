function rupiah(n){
  return "Rp " + (Number(n) || 0).toLocaleString("id-ID");
}

function loadKas(){
  const db = getDB();
  const tbody = document.getElementById("listKas");
  if(!tbody) return;

  let kasMasuk = 0;
  let kasKeluar = 0;
  tbody.innerHTML = "";

  /* ===== SIMPANAN (MASUK) ===== */
  (db.simpanan || []).forEach(s=>{
    kasMasuk += Number(s.jumlah);
    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal || "-"}</td>
        <td>Simpanan (${s.jenis})</td>
        <td>${rupiah(s.jumlah)}</td>
        <td>-</td>
      </tr>
    `;
  });

  /* ===== ANGSURAN (MASUK) ===== */
  (db.transaksi || [])
    .filter(t => t.jenis === "BAYAR" || t.jenis === "ANGSURAN")
    .forEach(t=>{
      kasMasuk += Number(t.jumlah);
      tbody.innerHTML += `
        <tr>
          <td>${t.tanggal || "-"}</td>
          <td>Angsuran Pinjaman</td>
          <td>${rupiah(t.jumlah)}</td>
          <td>-</td>
        </tr>
      `;
    });

  /* ===== PINJAMAN (KELUAR) ===== */
  (db.pinjaman || []).forEach(p=>{
    kasKeluar += Number(p.jumlah);
    tbody.innerHTML += `
      <tr>
        <td>${p.tanggal || "-"}</td>
        <td>Pencairan Pinjaman</td>
        <td>-</td>
        <td>${rupiah(p.jumlah)}</td>
      </tr>
    `;
  });

  document.getElementById("kasMasuk").innerText  = rupiah(kasMasuk);
  document.getElementById("kasKeluar").innerText = rupiah(kasKeluar);
  document.getElementById("saldoKas").innerText  = rupiah(kasMasuk - kasKeluar);
}
