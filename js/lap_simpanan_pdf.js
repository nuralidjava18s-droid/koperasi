const { jsPDF } = window.jspdf;

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

function exportSimpananPDF(){
  const db = getDB();
  const doc = new jsPDF("p","mm","a4");

  /* =====================
     KOP
  ===================== */
  doc.setFontSize(14);
  doc.text("KOPERASI DRIVER ARFA",105,15,{align:"center"});
  doc.setFontSize(10);
  doc.text("Laporan Simpanan Anggota",105,22,{align:"center"});
  doc.line(15,26,195,26);

  /* =====================
     DATA
  ===================== */
  let body = [];
  let total = 0;

  db.simpanan.forEach((s,i)=>{
    const anggota = db.anggota.find(a=>a.id === s.anggota_id);

    body.push([
      i+1,
      s.tanggal,
      anggota ? anggota.nama : "-",
      s.jenis,
      rupiah(s.jumlah)
    ]);

    total += Number(s.jumlah);
  });

  /* =====================
     TABLE
  ===================== */
  doc.autoTable({
    startY:30,
    head:[["No","Tanggal","Anggota","Jenis","Jumlah"]],
    body:body,
    styles:{fontSize:9},
    headStyles:{fillColor:[30,144,255]}
  });

  let y = doc.lastAutoTable.finalY + 8;

  /* =====================
     TOTAL
  ===================== */
  doc.setFontSize(11);
  doc.text("Total Simpanan : " + rupiah(total),15,y);

  /* =====================
     FOOTER
  ===================== */
  const tgl = new Date().toLocaleDateString("id-ID");
  doc.setFontSize(9);
  doc.text("Dicetak : " + tgl,150,285);

  doc.save("laporan_simpanan.pdf");
}