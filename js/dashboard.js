function rupiah(n){
  return "Rp " + Number(n).toLocaleString("id-ID");
}

function loadSaldoDashboard(){
  const db = getDB();

  let masuk = 0;
  let keluar = 0;

  // SIMPANAN
  db.simpanan.forEach(s=>{
    masuk += Number(s.jumlah);
  });

  // ANGSURAN
  db.transaksi
    .filter(t=>t.jenis === "BAYAR")
    .forEach(t=>{
      masuk += Number(t.jumlah);
    });

  // PINJAMAN
  db.pinjaman.forEach(p=>{
    keluar += Number(p.jumlah);
  });

  // KAS MANUAL
  db.kas.forEach(k=>{
    if(k.jenis === "MASUK"){
      masuk += Number(k.jumlah);
    }else{
      keluar += Number(k.jumlah);
    }
  });

  document.getElementById("kasMasukDashboard").innerText  = rupiah(masuk);
  document.getElementById("kasKeluarDashboard").innerText = rupiah(keluar);
  document.getElementById("saldoKasDashboard").innerText  = rupiah(masuk - keluar);
}

document.addEventListener("DOMContentLoaded", loadSaldoDashboard);