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
    const jml = Number(s.jumlah || 0);
    kasMasuk += jml;
    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal || "-"}</td>
        <td>Simpanan (${s.jenis})</td>
        <td>${rupiah(jml)}</td>
        <td>-</td>
      </tr>
    `;
  });

  /* ===== ANGSURAN PINJAMAN (MASUK) ===== */
  (db.transaksi || [])
    .filter(t => t.jenis === "BAYAR")
    .forEach(t=>{
      const jml = Number(t.jumlah || 0);
      kasMasuk += jml;
      tbody.innerHTML += `
        <tr>
          <td>${t.tanggal || "-"}</td>
          <td>Angsuran Pinjaman</td>
          <td>${rupiah(jml)}</td>
          <td>-</td>
        </tr>
      `;
    });

  /* ===== PINJAMAN (KELUAR) ===== */
  (db.pinjaman || []).forEach(p=>{
    const jml = Number(p.jumlah || 0);
    kasKeluar += jml;
    tbody.innerHTML += `
      <tr>
        <td>${p.tanggal || "-"}</td>
        <td>Pencairan Pinjaman</td>
        <td>-</td>
        <td>${rupiah(jml)}</td>
      </tr>
    `;
  });

  /* ===== KAS MANUAL ===== */
  (db.kas || []).forEach(k=>{
    const jml = Number(k.jumlah || 0);
    if(k.jenis === "masuk"){
      kasMasuk += jml;
    }else if(k.jenis === "keluar"){
      kasKeluar += jml;
    }

    tbody.innerHTML += `
      <tr>
        <td>${k.tanggal || "-"}</td>
        <td>${k.keterangan || "Kas Manual"}</td>
        <td>${k.jenis === "masuk" ? rupiah(jml) : "-"}</td>
        <td>${k.jenis === "keluar" ? rupiah(jml) : "-"}</td>
      </tr>
    `;
  });

  document.getElementById("kasMasuk").innerText   = rupiah(kasMasuk);
  document.getElementById("kasKeluar").innerText = rupiah(kasKeluar);
  document.getElementById("saldoKas").innerText  = rupiah(kasMasuk - kasKeluar);
}
