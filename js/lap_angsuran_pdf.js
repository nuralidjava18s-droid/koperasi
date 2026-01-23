const { jsPDF } = window.jspdf;

function rupiah(n){
  return "Rp " + Number(n||0).toLocaleString("id-ID");
}

function exportAngsuranPDF(){
  const db = getDB();
  const doc = new jsPDF("p","mm","a4");

  /* =====================
     KOP
  ===================== */
  doc.setFontSize(14);
  doc.text("KOPERASI DRIVER ARFA",105,15,{align:"center"});
  doc.setFontSize(10);
  doc.text("Laporan Angsuran Pinjaman",105,22,{align:"center"});
  doc.line(15,26,195,26);

  /* =====================
     DATA
  ===================== */
  let body = [];
  let totalBayar = 0;

  db.transaksi.forEach((t,i)=>{
    const a = db.anggota.find(x=>x.id === t.anggota_id);
    const p = db.pinjaman.find(x=>x.id === t.pinjamanId);

    body.push([
      i+1,
      a ? a.nama : "-",
      t.tanggal,
      rupiah(t.jumlah),
      p ? rupiah(p.sisa) : "-"
    ]);

    totalBayar += Number(t.jumlah);
  });

  /* =====================
     TABLE
  ===================== */
  doc.autoTable({
    startY:30,
    head:[["No","Anggota","Tanggal","Bayar","Sisa Pinjaman"]],
    body:body,
    styles:{fontSize:9},
    headStyles:{fillColor:[30,144,255]}
  });

  let y = doc.lastAutoTable.finalY + 8;

  /* =====================
     TOTAL
  ===================== */
  doc.setFontSize(11);
  doc.text("Total Angsuran Dibayar : " + rupiah(totalBayar),15,y);

  /* =====================
     FOOTER
  ===================== */
  const tgl = new Date().toLocaleDateString("id-ID");
  doc.setFontSize(9);
  doc.text("Dicetak : " + tgl,150,285);

  doc.save("laporan_angsuran.pdf");
}
