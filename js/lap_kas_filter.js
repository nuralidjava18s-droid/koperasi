function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

/* =====================
   LOAD KAS FILTER
===================== */
function loadKasFilter(){
  const db = getDB();
  const tbody = document.getElementById("listKas");

  const fKet   = document.getElementById("filterKet").value.toLowerCase();
  const fJenis = document.getElementById("filterJenis").value;

  let kasMasuk = 0;
  let kasKeluar = 0;

  tbody.innerHTML = "";
  filteredKas = [];

  (db.kas || [])
    .filter(k => !fJenis || k.jenis === fJenis)
    .filter(k => !fKet || k.keterangan.toLowerCase().includes(fKet))
    .forEach(k=>{
      filteredKas.push(k);

      if(k.jenis === "MASUK"){
        kasMasuk += Number(k.jumlah);
      }else{
        kasKeluar += Number(k.jumlah);
      }

      tbody.innerHTML += `
        <tr>
          <td>${k.tanggal}</td>
          <td>${k.keterangan}</td>
          <td>${k.jenis==="MASUK" ? rupiah(k.jumlah) : "-"}</td>
          <td>${k.jenis==="KELUAR" ? rupiah(k.jumlah) : "-"}</td>
        </tr>`;
    });

  document.getElementById("kasMasuk").innerText = rupiah(kasMasuk);
  document.getElementById("kasKeluar").innerText = rupiah(kasKeluar);
  document.getElementById("saldoKas").innerText = rupiah(kasMasuk - kasKeluar);
}