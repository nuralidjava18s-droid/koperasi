function rupiah(n){ 
  return "Rp " + Number(n).toLocaleString("id-ID"); 
}
function simpanKas(){
  const tgl = document.getElementById("tglKas").value;
  const ket = document.getElementById("ketKas").value;
  const jenis = document.getElementById("jenisKas").value;
  const jumlah = document.getElementById("jumlahKas").value;

  if(!tgl || !ket || !jumlah){
    alert("Lengkapi data!";
    
    return;
  }

  const db = getDB();

  db.kas.push({
    tanggal: tgl,
    keterangan: ket,
    jenis: jenis,   // MASUK / KELUAR
    jumlah: Number(jumlah)
  });

  saveDB(db);
  loadKas();

  // reset form
  document.getElementById("tglKas").value = "";
  document.getElementById("ketKas").value = "";
  document.getElementById("jumlahKas").value = "";
}

/* EXPORT PDF */
function exportPDF(){
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Rekap Kas Masuk & Keluar", 14, 20);

  const masuk = document.getElementById("kasMasuk").innerText;
  const keluar = document.getElementById("kasKeluar").innerText;
  const saldo = document.getElementById("saldoKas").innerText;

  doc.setFontSize(12);
  doc.text(`Kas Masuk: ${masuk}`, 14, 30);
  doc.text(`Kas Keluar: ${keluar}`, 14, 38);
  doc.text(`Saldo Kas: ${saldo}`, 14, 46);

  const tbody = document.querySelectorAll("#listKas tr");
  const data = [];
  tbody.forEach(tr=>{
    const row = [];
    tr.querySelectorAll("td").forEach(td=>row.push(td.innerText));
    data.push(row);
  });

  doc.autoTable({
    startY: 55,
    head:[["Tanggal","Keterangan","Masuk","Keluar"]],
    body:data,
    theme:"grid",
    headStyles:{fillColor:[30,144,255], textColor:255},
    styles:{cellPadding:3}
  });

  doc.save("rekap_kas_plus.pdf");
}

/* EXPORT WHATSAPP */
function exportWA(){
  const tbody = document.querySelectorAll("#listKas tr");
  if(tbody.length===0){ alert("Tidak ada data!"); return; }

  let text = `Rekap Kas Masuk & Keluar:\n`;
  text += `Kas Masuk: ${document.getElementById("kasMasuk").innerText}\n`;
  text += `Kas Keluar: ${document.getElementById("kasKeluar").innerText}\n`;
  text += `Saldo Kas: ${document.getElementById("saldoKas").innerText}\n\n`;
  text += "Tanggal | Keterangan | Masuk | Keluar\n";

  tbody.forEach(tr=>{
    const tds = tr.querySelectorAll("td");
    text += `${tds[0].innerText} | ${tds[1].innerText} | ${tds[2].innerText} | ${tds[3].innerText}\n`;
  });

  const waLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(waLink,'_blank');
}
