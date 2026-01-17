function rupiah(n){
  return "Rp " + Number(n).toLocaleString("id-ID");
}

/* LOAD DATA */
function loadKas(){
  const db = getDB();
  const tbody = document.getElementById("listKas");

  let kasMasuk = 0;
  let kasKeluar = 0;

  tbody.innerHTML = "";

  /* SIMPANAN */
  db.simpanan.forEach(s=>{
    kasMasuk += Number(s.jumlah);
    tbody.innerHTML += `
      <tr>
        <td>${s.tanggal}</td>
        <td>Simpanan (${s.jenis})</td>
        <td>${rupiah(s.jumlah)}</td>
        <td>-</td>
      </tr>`;
  });

  /* ANGSURAN */
  db.transaksi.filter(t=>t.jenis==="BAYAR").forEach(t=>{
    kasMasuk += Number(t.jumlah);
    tbody.innerHTML += `
      <tr>
        <td>${t.tanggal}</td>
        <td>Angsuran Pinjaman</td>
        <td>${rupiah(t.jumlah)}</td>
        <td>-</td>
      </tr>`;
  });

  /* PINJAMAN */
  db.pinjaman.forEach(p=>{
    kasKeluar += Number(p.jumlah);
    tbody.innerHTML += `
      <tr>
        <td>${p.tanggal}</td>
        <td>Pencairan Pinjaman</td>
        <td>-</td>
        <td>${rupiah(p.jumlah)}</td>
      </tr>`;
  });

  /* KAS MANUAL */
  db.kas.forEach(k=>{
    if(k.jenis==="MASUK"){
      kasMasuk += k.jumlah;
      tbody.innerHTML += `
        <tr>
          <td>${k.tanggal}</td>
          <td>${k.keterangan}</td>
          <td>${rupiah(k.jumlah)}</td>
          <td>-</td>
        </tr>`;
    }else{
      kasKeluar += k.jumlah;
      tbody.innerHTML += `
        <tr>
          <td>${k.tanggal}</td>
          <td>${k.keterangan}</td>
          <td>-</td>
          <td>${rupiah(k.jumlah)}</td>
        </tr>`;
    }
  });

  document.getElementById("kasMasuk").innerText = rupiah(kasMasuk);
  document.getElementById("kasKeluar").innerText = rupiah(kasKeluar);
  document.getElementById("saldoKas").innerText = rupiah(kasMasuk - kasKeluar);
}

/* SIMPAN KAS */
function simpanKas(){
  const tgl = tglKas.value;
  const ket = ketKas.value;
  const jenis = jenisKas.value;
  const jumlah = Number(jumlahKas.value);

  if(!tgl || !ket || !jumlah){
    alert("Lengkapi data!");
    return;
  }

  const db = getDB();
  db.kas.push({ tanggal:tgl, keterangan:ket, jenis, jumlah });
  saveDB(db);

  tglKas.value = ketKas.value = jumlahKas.value = "";
  loadKas();
}

/* EXPORT PDF */
function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Rekap Kas",14,15);
  doc.text(`Kas Masuk: ${kasMasuk.innerText}`,14,25);
  doc.text(`Kas Keluar: ${kasKeluar.innerText}`,14,32);
  doc.text(`Saldo: ${saldoKas.innerText}`,14,39);

  const data=[];
  document.querySelectorAll("#listKas tr").forEach(tr=>{
    const row=[];
    tr.querySelectorAll("td").forEach(td=>row.push(td.innerText));
    data.push(row);
  });

  doc.autoTable({
    startY:45,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:data
  });

  doc.save("rekap_kas.pdf");
}

/* EXPORT WA */
function exportWA(){
  let text = `Rekap Kas\nKas Masuk: ${kasMasuk.innerText}\nKas Keluar: ${kasKeluar.innerText}\nSaldo: ${saldoKas.innerText}\n\n`;
  document.querySelectorAll("#listKas tr").forEach(tr=>{
    const td = tr.querySelectorAll("td");
    text += `${td[0].innerText} | ${td[1].innerText} | ${td[2].innerText} | ${td[3].innerText}\n`;
  });
  window.open("https://wa.me/?text="+encodeURIComponent(text));
}
