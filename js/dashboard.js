function rupiah(n){
  return "Rp " + (Number(n) || 0).toLocaleString("id-ID");
}

function hitungTotalSaldo(){
  const db = getDB();
  let saldo = 0;

  /* ===== KAS MANUAL ===== */
  (db.kas || []).forEach(k=>{
    if(k.jenis === "masuk") saldo += Number(k.jumlah);
    if(k.jenis === "keluar") saldo -= Number(k.jumlah);
  });

  /* ===== SIMPANAN ===== */
  (db.simpanan || []).forEach(s=>{
    saldo += Number(s.jumlah);
  });

  /* ===== PINJAMAN (UANG KELUAR) ===== */
  (db.pinjaman || []).forEach(p=>{
    saldo -= Number(p.jumlah);
  });

  /* ===== ANGSURAN (UANG MASUK) ===== */
  (db.transaksi || [])
    .filter(t => t.jenis === "BAYAR" || t.jenis === "ANGSURAN")
    .forEach(t=>{
      saldo += Number(t.jumlah);
    });

  return saldo;
}

function loadDashboard(){
  const el = document.getElementById("totalSaldo");
  if(!el) return;

  el.innerText = rupiah(hitungTotalSaldo());
}
