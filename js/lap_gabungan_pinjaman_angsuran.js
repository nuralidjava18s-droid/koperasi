function exportGabunganPDF(){
  const db = getDB();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p","mm","a4");

  /* ================= HEADER ================= */
  doc.setFontSize(14);
  doc.text("KOPERASI DRIVER ARFA",105,15,{align:"center"});
  doc.setFontSize(10);
  doc.text("Laporan Pinjaman & Angsuran",105,21,{align:"center"});
  doc.line(15,25,195,25);

  /* ================= PINJAMAN ================= */
  doc.setFontSize(12);
  doc.text("DATA PINJAMAN",105,33,{align:"center"});

  let bodyPinjaman = [];

  db.pinjaman.forEach((p,i)=>{
    const a = db.anggota.find(x=>x.id===p.anggota_id);
    bodyPinjaman.push([
      i+1,
      a?.nama || "-",
      rupiah(p.jumlah),
      p.tenor + " bln",
      rupiah(p.sisa),
      p.sisa<=0 ? "LUNAS" : "AKTIF"
    ]);
  });

  doc.autoTable({
    startY:38,
    head:[["No","Nama","Pinjaman","Tenor","Sisa","Status"]],
    body:bodyPinjaman,
    styles:{fontSize:9},
    headStyles:{fillColor:[0,123,255]}
  });

  /* ================= ANGSURAN ================= */
  let y = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(12);
  doc.text("RIWAYAT ANGSURAN",105,y,{align:"center"});

  let bodyAngsuran = [];

  db.transaksi.forEach((t,i)=>{
    const a = db.anggota.find(x=>x.id===t.anggota_id);
    bodyAngsuran.push([
      i+1,
      a?.nama || "-",
      rupiah(t.jumlah),
      t.tanggal
    ]);
  });

  doc.autoTable({
    startY:y+5,
    head:[["No","Nama","Jumlah Bayar","Tanggal"]],
    body:bodyAngsuran,
    styles:{fontSize:9},
    headStyles:{fillColor:[40,167,69]}
  });

  /* ================= FOOTER ================= */
  doc.setFontSize(9);
  doc.text(
    "Dicetak: " + new Date().toLocaleDateString("id-ID"),
    150,285
  );

  doc.save("laporan_pinjaman_angsuran.pdf");
}
