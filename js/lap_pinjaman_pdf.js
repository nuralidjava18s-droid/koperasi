const { jsPDF } = window.jspdf;

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

function exportPinjamanPDF(){
  const db = getDB();
  const doc = new jsPDF("p","mm","a4");

  /* =====================
     KOP
  ===================== */
  doc.setFontSize(14);
  doc.text("KOPERASI DRIVER ARFA",105,15,{align:"center"});
  doc.setFontSize(10);
  doc.text("Laporan Pinjaman Anggota",105,22,{align:"center"});
  doc.line(15,26,195,26);

  /* =====================
     DATA
  ===================== */
  let body = [];
  let totalPinjaman = 0;
  let totalSisa = 0;

  db.pinjaman.forEach((p,i)=>{
    const anggota = db.anggota.find(a=>a.id === p.anggota_id);

    body.push([
      i+1,
      anggota ? anggota.nama : "-",
      rupiah(p.jumlah),
      p.tenor + " bln",
      rupiah(p.sisa),
      p.sisa <= 0 ? "LUNAS" : "AKTIF"
    ]);

    totalPinjaman += Number(p.jumlah);
    totalSisa += Number(p.sisa);
  });

  /* =====================
     TABLE
  ===================== */
  doc.autoTable({
    startY:30,
    head:[["No","Anggota","Pinjaman","Tenor","Sisa","Status"]],
    body:body,
    styles:{fontSize:9},
    headStyles:{fillColor:[30,144,255]}
  });

  let y = doc.lastAutoTable.finalY + 8;

  /* =====================
     REKAP
  ===================== */
  doc.setFontSize(11);
  doc.text("Total Pinjaman : " + rupiah(totalPinjaman),15,y);
  doc.text("Total Sisa Pinjaman : " + rupiah(totalSisa),15,y+6);

  /* =====================
     FOOTER
  ===================== */
  const tgl = new Date().toLocaleDateString("id-ID");
  doc.setFontSize(9);
  doc.text("Dicetak : " + tgl,150,285);

  doc.save("laporan_pinjaman.pdf");
}
